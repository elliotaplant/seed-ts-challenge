const Gdax = require('gdax');
const uuid = require('uuid');

// GdaxSocket is a class to maintain data gathered from the GDAX API
class GdaxSocket {

  constructor() {
    // Handlers listening to the 'update' event
    this.updateHandlers = {};

    // Frequency to send updates to WS clients
    this.UPDATE_INTERVAL = 500; // ms

    // Store maps of price:size to send to front end
    this.asks = {};
    this.bids = {};

    // Number of orders to maintain on the server
    this.storageSize = 50;

    // Number of orders to send to clients on update
    this.sendSize = 25;

    // Midpoint price
    this.midpoint = 0;

    // Constants for the GDAX API
    this.EXCHANGES = ['BTC-USD'];
    this.GDAX_WS_URL = 'wss://ws-feed.gdax.com';
    this.GDAX_WS_OPTIONS = {channels: ['level2']};
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
    const websocket = new Gdax.WebsocketClient(this.EXCHANGES, this.GDAX_WS_URL, null, this.GDAX_WS_OPTIONS);
    this.interval = setInterval(() => this.sendUpdate(), this.UPDATE_INTERVAL);

    websocket.on('message', (data) => {
      if (data.type === 'snapshot') {
        this.handleSnapshot(data);
        this.sendUpdate();
      } else if (data.type === 'l2update') {
        this.handleUpdate(data);
      }
    });

    websocket.on('close', () => {
      clearInterval(this.interval);
    });
  }

  // On the initial 'snapshot' event, create the asks and bids data
  handleSnapshot(data) {
    const {asks, bids} = data;
    this.asks = this.pruneSizeMap(this.ordersToSizeMap(asks), null, -1);
    this.bids = this.pruneSizeMap(this.ordersToSizeMap(bids));
  }

  // On each update from GDAX, update the internal price state
  handleUpdate(data) {
    const {changes, type} = data;

    // Find the maxBuy and minSell to remove overlap that didn't get deleted by gdax
    const maxBuy = this.maxBuy(changes);
    const minSell = this.minSell(changes);

    // Separate the buy and sell data in the changes
    const {buy, sell} = this.changesToSizeMaps(changes);

    // Update the stored asks and bids with the new changes
    this.asks = this.pruneSizeMap({ ...this.asks, ...sell }, maxBuy, -1);
    this.bids = this.pruneSizeMap({ ...this.bids, ...buy }, minSell);
  }

  // Converts a list of orders [ [price, size] ] to a size map { price: size }
  ordersToSizeMap(orders) {
    return orders.reduce((priceMap, [price, size]) => {
      priceMap[this.serializePrice(price)] = size;
      return priceMap
    }, {});
  }

  // Converts a list of changes [ [side, price, size] ] to size maps for buy and sell sides
  changesToSizeMaps(changes) {
    return changes.reduce((priceMaps, [side, price, size]) => {
      priceMaps[side][price] = size;
      return priceMaps
    }, {
      buy: {},
      sell: {}
    });
  }

  // Prunes a size map by removing overlapping orders and orders with size "0"
  pruneSizeMap(priceMap, overlap, direction) {
    const filteredOrders = Object.keys(priceMap)
      .filter(price => priceMap[price] !== '0')
      .filter(price => !overlap || (direction === -1 ? +price > +overlap : +price < +overlap));

    const sortedOrders = this.sortPrices(filteredOrders);
    const slicedOrders = direction === -1
      ? sortedOrders.slice(-this.storageSize)
      : sortedOrders.slice(0, this.storageSize);
    return this.ordersToSizeMap(slicedOrders.map(price => [
      price, priceMap[price]
    ]));
  }

  // Sorts a string list of prices from high to low
  sortPrices(prices) {
    return prices.sort((a, b) => (+a < +b ? 1 : (+a > +b ? -1 : 0)));
  }

  // Serializes a string price to always have 8 digit precision
  serializePrice(price) {
    return (+price).toFixed(8);
  }

  // Converts a size map to a list of orders [ {price, size} ]
  sizeMapToOrders(priceMap) {
    return Object.keys(priceMap)
      .map(this.serializePrice)
      .map(price => ({price, size: priceMap[price]}));
  }

  // Finds the maximum buy order in a list of changes
  maxBuy(changes) {
    return changes.filter(([side, price, size]) => side === 'buy' && size !== '0')
      .map(([s, price]) => price)
      .sort(this.sortPrices)[0];
  }

  // Finds the minimum sell order in a list of changes
  minSell(changes) {
    return changes.filter(([side, price, size]) => side === 'sell' && size !== '0')
      .map(([s, price]) => price)
      .sort(this.sortPrices)
      .slice(-1)[0];
  }

  // Formats the price state to be digested by the front end
  formatPriceData() {
    // Gets asks and bids closest to the midpoint
    const asks = this.sizeMapToOrders(this.asks).slice(-this.sendSize);
    const bids = this.sizeMapToOrders(this.bids).slice(0, this.sendSize);

    // Calfulates data about the midpoint
    const {midpoint, spread} = this.calculateMidpointSpread(bids, asks);
    const midpointDelta = this.calculateMidpointDelta(midpoint);
    if (midpointDelta !== 0) {
      this.midpointDelta = midpointDelta;
    }
    this.midpoint = midpoint;

    // Packages the state to be sent to the FE
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
