const Gdax = require('gdax');
const uuid = require('uuid');

class GdaxSocket {
  // Initialize listeners
  constructor() {
    // List of listeners for updates
    this.updateHandlers = {};

    // Store maps of price:size to send to front end
    this.asks = {};
    this.bids = {};

    // Number of orders to maintain on the server
    this.storageSize = 50;

    // Number of orders to send to clients on update
    this.sendSize = 25;
  }

  onUpdate(handler) {
    const id = uuid();
    this.updateHandlers[id] = handler;
    return id;
  }

  removeHandler(id) {
    delete this.updateHandlers[id];
  }

  sendUpdate() {
    Object.keys(this.updateHandlers).forEach(handlerId => this.updateHandlers[handlerId]({
      asks: this.priceMapToOrders(this.asks).slice(0, this.sendSize),
      bids: this.priceMapToOrders(this.bids).slice(-this.sendSize)
    }));
  }

  init() {
    const websocket = new Gdax.WebsocketClient(['BTC-USD'], 'wss://ws-feed.gdax.com', null, {channels: ['level2']});
    this.interval = setInterval(() => this.sendUpdate(), 500);

    websocket.on('message', (data) => {

      if (data.type === 'snapshot') {
        let {asks, bids, type} = data;
        this.asks = this.pruneSizeMap(this.ordersToPriceMap(asks));
        this.bids = this.pruneSizeMap(this.ordersToPriceMap(bids), null, -1);
        this.sendUpdate();
      } else if (data.type === 'l2update') {
        const {changes, type} = data;

        // Find the maxBuy and minSell to remove overlap that didn't get deleted by gdax
        const maxBuy = this.maxBuy(changes);
        const minSell = this.minSell(changes);

        const {buy, sell} = this.changesToPriceMaps(changes);
        this.asks = this.pruneSizeMap({
          ...this.asks,
          ...sell
        }, maxBuy);
        this.bids = this.pruneSizeMap({
          ...this.bids,
          ...buy
        }, minSell, -1);
      }
    });

    websocket.on('close', () => {
      clearInterval(this.interval);
    });
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

  pruneSizeMap(priceMap, overlap, direction) {
    const filteredOrders = Object.keys(priceMap)
      .filter(price => priceMap[price] !== '0')
      .filter(price => !overlap || (direction === -1 ? +price < +overlap : +price > +overlap));

    const sortedOrders = this.sortPrices(filteredOrders);
    const slicedOrders = direction === -1
      ? sortedOrders.slice(-this.storageSize)
      : sortedOrders.slice(0, this.storageSize);
    return this.ordersToPriceMap(slicedOrders.map(price => [
      price, priceMap[price]
    ]));
  }

  sortPrices(prices) {
    return prices.sort((a, b) => (+a > +b ? 1 : (+a < +b ? -1 : 0)));
  }

  priceMapToOrders(priceMap) {
    return Object.keys(priceMap).map(price => ({price, size: priceMap[price]}));
  }

  maxBuy(changes) {
    return changes.filter(([side, price, size]) => side === 'buy' && size !== '0')
      .map(([s, price]) => price)
      .sort(this.sortPrices)
      .slice(-1)[0];
  }

  minSell(changes) {
    return changes.filter(([side, price, size]) => side === 'sell' && size !== '0')
      .map(([s, price]) => price)
      .sort(this.sortPrices)[0];
  }
}

module.exports = GdaxSocket;
