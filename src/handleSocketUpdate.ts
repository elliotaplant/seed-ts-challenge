import store from './store';
import { updateOrdersAction } from './store/actions/order';
import { IOrdersUpdate } from './types';

// import store from './store';
export default function handleSocketUpdate(update: any) {
  let asJson: IOrdersUpdate;
  try {
    asJson = JSON.parse(update);
  } catch (error) {
    return console.error('Unable to parse message as JSON');
  }

  store.dispatch(updateOrdersAction(asJson));
}
