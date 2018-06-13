import * as Gdax from 'gdax';
import { WebsocketMessage } from 'gdax';

class GdaxSocket {
  constructor(
    private onSnapshot: (data: WebsocketMessage.L2Snapshot) => void,
    private onUpdate: (data: WebsocketMessage.L2Update) => void,
    private onError: (err: any) => void,
    private onClose: () => void
  ) { }

  public init() {
    // const websocket = new Gdax.WebsocketClient(['BTC-USD', 'ETH-USD'],
    //   'ws://localhost:8080', undefined, { channels: ['level2'] });
    const websocket = new Gdax.WebsocketClient(['BTC-USD', 'ETH-USD'], 'wss://ws.coinapi.io/v1/', undefined, { channels: ['level2'] });

    websocket.on('message', (data: WebsocketMessage) => {
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

export default GdaxSocket;
