import { SNAPSHOT, UPDATE_ORDER } from '../types';

// Reducer for handling all actions
export default function reducer(state = {
  asks: [],
  bids: [],
  connecting: false,
  error: '',
}, { type, payload }: any) {
  // The search request has been sent
  if (type === SNAPSHOT) {
    const { asks, bids } = payload;
    return { ...state, asks, bids };
  } else if (type === UPDATE_ORDER) {
    return {
      ...state,
      connecting: false,
      error: '',
      orders: payload.orders
    };
  }
  return state;
}
