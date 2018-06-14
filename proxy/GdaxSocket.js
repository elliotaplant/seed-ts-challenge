const Gdax = require('gdax');
const uuid = require('uuid');

class GdaxSocket {
  // Initialize listeners
  constructor() {
    this.onSnapshot = {};
    this.onError = {};
    this.onClose = {};

    // Store list of asks and bids to send to front end
    this.asks = [];
    this.bids = [];
  }

  onUpdate(handler) {
    this.updateHandler = handler;
  }

  sendUpdate() {
    this.updateHandler({ asks: this.priceMapToOrders(this.asks), bids: this.priceMapToOrders(this.bids) })
  }

  addListener(type, handler) {
    // const id = uuid();
    // if (type === 'snapshot') {
    //   this.onSnapshot[id] = handler;
    // } else if (type === 'update') {
    //   this.onUpdate[id] = handler;
    // } else if (type === 'error') {
    //   this.onError[id] = handler;
    // } else if (type === 'close') {
    //   this.onClose[id] = handler;
    // }
    // return id;
  }

  removeListener(type, id) {
    if (type === 'snapshot') {
      delete this.onSnapshot[id];
    } else if (type === 'update') {
      delete this.onUpdate[id];
    } else if (type === 'error') {
      delete this.onError[id];
    } else if (type === 'close') {
      delete this.onClose[id];
    }
    return id;
  }

  init() {
    const websocket = new Gdax.WebsocketClient(['BTC-USD'], 'wss://ws-feed.gdax.com', null, {channels: ['level2']});

    websocket.on('message', (data) => {
      this.interval = setInterval(() => this.sendUpdate(), 100);

      if (data.type === 'snapshot') {
        let {asks, bids, type} = data;
        this.asks = this.ordersToPriceMap(asks);
        this.bids = this.ordersToPriceMap(bids);
        // this.asks = this.sortOrders(asks).slice(-30);
        // this.bids = this.sortOrders(bids).slice(0, 30);
        this.sendUpdate();
      } else if (data.type === 'l2update') {
        const {changes, type} = data;
        const {buy, sell} = this.changesToPriceMaps(changes);
        this.asks = this.pruneSizeMap({
          ...this.asks,
          ...sell
        });
        this.bids = this.pruneSizeMap({
          ...this.bids,
          ...buy
        }, -1);
        // const toUpdate = changes.filter(([s, p, size]) => size === 0).map(([side, price]) => price));
        // const newAsks = changes
        //   .filter(([side]) => side === 'sell')
        //   .map(([side, price, size]) => ([price, size]));
        // const newBids = changes.filter(([side]) => side === 'buy').map(([side, price, size]) => ([price, size]));
        //
        // this.asks = this.sortOrders(this.asks.concat(newAsks)).slice(-30);
        // this.bids = this.sortOrders(this.asks.concat(newBids)).slice(0, 30);
        // Don't send update to FE on every update - it's too much for the FE to handle
      }
    });
    websocket.on('error', error => {
      this.callAllHandlers(this.onError, error)
    });
    websocket.on('close', () => {
      clearInterval(this.interval);
      this.callAllHandlers(this.onClose)
    });
  }

  callAllHandlers(handlerMap, data) {
    for (let handler in handlerMap) {
      data
        ? handlerMap[handler](data)
        : handlerMap[handler]();
    }
  }

  ordersToPriceMap(orders) {
    return orders.reduce((priceMap, [price, size]) => {
      priceMap[price] = size;
      return priceMap
    }, {});
  }

  changesToPriceMaps(changes) {
    return changes.reduce((priceMaps, [side, price, size]) => {
      priceMaps[side][price] = size;
      return priceMaps
    }, {
      buy: {},
      sell: {}
    });
  }

  pruneSizeMap(priceMap, direction) {
    const filteredOrders = Object.keys(priceMap)
      .filter(price => priceMap[price] !== '0');
    const sortedOrders = this.sortOrders(filteredOrders);
    const slicedOrders = direction === -1 ? sortedOrders.slice(-30) : sortedOrders.slice(0, 30);
    return this.ordersToPriceMap(slicedOrders.map(price => [price, priceMap[price]]));
}

  sortOrders(orders) {
    return orders.sort(([a], [b]) => (+a > +b ? 1 : ( +a < +b ? -1 : 0)));
  }

  priceMapToOrders(priceMap) {
    return Object.keys(priceMap).map(price => ({ price, size: priceMap[price] }));
  }
  digestOrders(orders) {
    return orders.slice(0, 20).reduce((allOrders, [price, size]) => {
      allOrders[price] = size;
      return allOrders
    }, {});
  }

  digestChanges(changes) {
    return changes.reduce((allChanges, [side, price, size]) => {
      if (size === '0') {
        allChanges[side].delete.push(price);
      } else {
        allChanges[side].update[price] = size;
      }
      return allChanges
    }, {
      buy: {
        update: {},
        delete: []
      },
      sell: {
        update: {},
        delete: []
      }
    });
  }
}

module.exports = GdaxSocket;
