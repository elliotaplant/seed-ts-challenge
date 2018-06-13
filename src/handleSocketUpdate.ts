import { WebsocketMessage } from './gdax-types';
import store from './store';
import { snapshotAction } from './store/actions/order';

// import store from './store';
export default function handleSocketUpdate(update: any) {
  let asJson: WebsocketMessage;
  try {
    asJson = JSON.parse(update);
  } catch (error) {
    return console.error('Unable to parse message as JSON');
  }

  console.log('asJson', asJson);
  if (asJson.type === 'snapshot') {
    console.log('got snapshot', asJson);
    store.dispatch(snapshotAction(asJson));
  } else if (asJson.type === 'l2update') {
    // console.log('got update', asJson);
  }
}
