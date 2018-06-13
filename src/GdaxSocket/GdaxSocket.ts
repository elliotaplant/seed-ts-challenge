import * as Gdax from 'gdax';
import { WebsocketMessage } from 'gdax';

interface ISocketError {
  moo: string;
}

class GdaxSocket {
  constructor(
    private onMessage: (data: WebsocketMessage) => void,
    private onError: (err: ISocketError) => void,
    private onClose: () => void
  ) { }

  public init() {
    const websocket = new Gdax.WebsocketClient(['BTC-USD', 'ETH-USD']);

    websocket.on('message', this.onMessage);
    websocket.on('error', this.onError);
    websocket.on('close', this.onClose);
  }
}

export default GdaxSocket;
