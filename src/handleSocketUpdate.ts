import { WebsocketMessage } from './gdax-types';

// import store from './store';
export default function handleSocketUpdate(update: any) {
  let asJson: WebsocketMessage;
  try {
    asJson = JSON.parse(update);
  } catch (error) {
    return console.error('Unable to parse message as JSON');
  }

  console.log('asJson.type', asJson.type);
  if (asJson.type === 'snapshot') {
    console.log('got snapshot', asJson);
  } else if (asJson.type === 'l2update') {
    console.log('got update', asJson);
  }
}
