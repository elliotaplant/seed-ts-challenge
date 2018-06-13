import { WebsocketMessage } from './gdax-types';
import store from './store';
import { snapshotAction, updateAction } from './store/actions/order';

// import store from './store';
export default function handleSocketUpdate(update: any) {
  let asJson: WebsocketMessage;
  try {
    asJson = JSON.parse(update);
  } catch (error) {
    return console.error('Unable to parse message as JSON');
  }

  if (asJson.type === 'snapshot') {
    store.dispatch(snapshotAction(asJson));
  } else if (asJson.type === 'l2update') {
    store.dispatch(updateAction(asJson));
  }
}
