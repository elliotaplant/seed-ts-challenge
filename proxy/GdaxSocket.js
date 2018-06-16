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

    // Initialize midpoint price
    this.midpoint = 0;
  }

  // Add a handler to the data update event
  onUpdate(handler) {
    const id = uuid();
    this.updateHandlers[id] = handler;
    return id;
  }

  // Remove a handler from the data update event
  removeHandler(id) {
    delete this.updateHandlers[id];
  }

  // Send an update to all listeners of the update event
  sendUpdate() {
    const priceData = this.formatPriceData();
    Object.keys(this.updateHandlers)
      .forEach(handlerId => this.updateHandlers[handlerId](priceData));
  }

  // Initialize the GDAX web socket
  init() {
    const websocket = new Gdax.WebsocketClient(['BTC-USD'], 'wss://ws-feed.gdax.com', null, {channels: ['level2']});
    this.interval = setInterval(() => this.sendUpdate(), 500);

    websocket.on('message', (data) => {

      if (data.type === 'snapshot') {
        // On the initial 'snapshot' event, create the asks and bids data
        let {asks, bids, type} = data;
        this.asks = this.pruneSizeMap(this.ordersToPriceMap(asks), null, -1);
        this.bids = this.pruneSizeMap(this.ordersToPriceMap(bids));
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
        }, maxBuy, -1);
        this.bids = this.pruneSizeMap({
          ...this.bids,
          ...buy
        }, minSell);
      }
    });

    websocket.on('close', () => {
      clearInterval(this.interval);
    });
  }

  ordersToPriceMap(orders) {
    return orders.reduce((priceMap, [price, size]) => {
      priceMap[this.serializePrice(price)] = size;
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
      .filter(price => !overlap || (direction === -1 ? +price > +overlap : +price < +overlap));

    const sortedOrders = this.sortPrices(filteredOrders);
    const slicedOrders = direction === -1
      ? sortedOrders.slice(-this.storageSize)
      : sortedOrders.slice(0, this.storageSize);
    return this.ordersToPriceMap(slicedOrders.map(price => [
      price, priceMap[price]
    ]));
  }

  sortPrices(prices) {
    return prices.sort((a, b) => (+a < +b ? 1 : (+a > +b ? -1 : 0)));
  }

  serializePrice(price) {
    return (+price).toFixed(8);
  }

  priceMapToOrders(priceMap) {
    return Object.keys(priceMap)
      .map(this.serializePrice)
      .map(price => ({price, size: priceMap[price]}));
  }

  maxBuy(changes) {
    return changes.filter(([side, price, size]) => side === 'buy' && size !== '0')
      .map(([s, price]) => price)
      .sort(this.sortPrices)[0];
  }

  minSell(changes) {
    return changes.filter(([side, price, size]) => side === 'sell' && size !== '0')
      .map(([s, price]) => price)
      .sort(this.sortPrices)
      .slice(-1)[0];
  }

  formatPriceData() {
    const asks = this.priceMapToOrders(this.asks).slice(-this.sendSize);
    const bids = this.priceMapToOrders(this.bids).slice(0, this.sendSize);


    const {midpoint, spread} = this.calculateMidpointSpread(bids, asks);
    const midpointDelta = this.calculateMidpointDelta(midpoint);
    if (midpointDelta !== 0) {
      this.midpointDelta = midpointDelta;
    }
    this.midpoint = midpoint;

    return {
      orders: {
        asks,
        bids
      },
      midpoint: {
        midpoint,
        spread,
        midpointDelta: this.midpointDelta
      }
    };
  }

  calculateMidpointSpread(bids, asks) {
    try {
      const maxBid = +bids[0].price;
      const minAsk = +asks[bids.length - 1].price;

      // Midpoint is the average of maxBid and minAsk
      const midpoint = (maxBid + minAsk) / 2;
      const spread = minAsk - maxBid;
      return {midpoint, spread};
    } catch (error) {
      return {midpoint: 0, spread: 0}
    }
  }

  calculateMidpointDelta(newMidpoint) {
    return (this.midpoint - newMidpoint) / this.midpoint;
  }
}

module.exports = GdaxSocket;
