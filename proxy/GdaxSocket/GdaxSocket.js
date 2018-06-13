const Gdax = require('gdax');

class GdaxSocket {
  constructor(onSnapshot, onUpdate, onError, onClose) {
    this.onSnapshot = onSnapshot;
    this.onUpdate = onUpdate;
    this.onError = onError;
    this.onClose = onClose;
  }

  init() {
    const websocket = new Gdax.WebsocketClient([
      'BTC-USD', 'ETH-USD'
    ], 'wss://ws.coinapi.io/v1/', undefined, {channels: ['level2']});

    websocket.on('message', (data) => {
      if (data.type === 'snapshot') {
        this.onSnapshot(data);
      } else if (data.type === 'l2update') {
        this.onUpdate(data);
      }
    });
    websocket.on('error', this.onError);
    websocket.on('close', this.onClose);
  }
}

module.exports = GdaxSocket;
