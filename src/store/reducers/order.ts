import { UPDATE_ORDER } from '../types';

// Reducer for handling all actions
export default function reducer(state = {
  connecting: false,
  error: '',
  orders: [],
}, {type, payload}) {
  // The search request has been sent
  if (type === UPDATE_ORDER) {
    return {
      ...state,
      connecting: false,
      error: '',
      orders: payload.orders
    };
  }
  return state;
}
