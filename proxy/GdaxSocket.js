const Gdax = require('gdax');
const uuid = require('uuid');

class GdaxSocket {
  // Initialize listeners
  constructor() {
    // Store list of asks and bids to send to front end
    this.id = uuid();
    this.asks = [];
    this.bids = [];
  }

  onUpdate(handler) {
    this.updateHandler = handler;
  }

  sendUpdate() {
    console.log('sending update', this.id);
    this.updateHandler({
      asks: this.priceMapToOrders(this.asks),
      bids: this.priceMapToOrders(this.bids)
    })
  }

  init() {
    const websocket = new Gdax.WebsocketClient(['BTC-USD'], 'wss://ws-feed.gdax.com', null, {channels: ['level2']});
    this.interval = setInterval(() => this.sendUpdate(), 500);

    websocket.on('message', (data) => {

      if (data.type === 'snapshot') {
        let {asks, bids, type} = data;
        this.asks = this.ordersToPriceMap(asks);
        this.bids = this.ordersToPriceMap(bids);
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

  pruneSizeMap(priceMap, direction) {
    const filteredOrders = Object.keys(priceMap).filter(price => priceMap[price] !== '0');
    const sortedOrders = this.sortOrders(filteredOrders);
    const slicedOrders = direction === -1
      ? sortedOrders.slice(-30)
      : sortedOrders.slice(0, 30);
    return this.ordersToPriceMap(slicedOrders.map(price => [
      price, priceMap[price]
    ]));
  }

  sortOrders(orders) {
    return orders.sort(([a], [b]) => (
      + a > + b
      ? 1
      : (
        + a < + b
        ? -1
        : 0)));
  }

  priceMapToOrders(priceMap) {
    return Object.keys(priceMap).map(price => ({price, size: priceMap[price]}));
  }
}

module.exports = GdaxSocket;
