const Gdax = require('gdax');
const uuid = require('uuid');

class GdaxSocket {
  // Initialize listeners
  constructor() {
    this.onSnapshot = {};
    this.onUpdate = {};
    this.onError = {};
    this.onClose = {};
  }

  addListener(type, handler) {
    const id = uuid();
    if (type === 'snapshot') {
      this.onSnapshot[id] = handler;
    } else if (type === 'update') {
      this.onUpdate[id] = handler;
    } else if (type === 'error') {
      this.onError[id] = handler;
    } else if (type === 'close') {
      this.onClose[id] = handler;
    }
    return id;
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
      if (data.type === 'snapshot') {
        let {asks, bids, type} = data;
        asks = this.digestOrders(asks);
        bids = this.digestOrders(bids);
        this.callAllHandlers(this.onSnapshot, JSON.stringify({asks, bids, type}));
      } else if (data.type === 'l2update') {
        let {changes, type} = data;
        changes = this.digestChanges(changes);
        this.callAllHandlers(this.onUpdate, JSON.stringify({changes, type}));
      }
    });
    websocket.on('error', error => {
      this.callAllHandlers(this.onError, error)
    });
    websocket.on('close', () => {
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

  digestOrders(orders) {
    return orders.slice(0, 100).reduce((allOrders, [price, size]) => {
      allOrders[price] = size;
      return allOrders
    }, {});
  }

  digestChanges(changes) {
    return changes.reduce((allChanges, [side, price, size]) => {
      allChanges[side][price] = size;
      return allChanges
    }, {
      buy: {},
      sell: {}
    });
  }
}

module.exports = GdaxSocket;
