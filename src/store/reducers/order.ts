import { IOrdersUpdate } from '../../types';
import { UPDATE_ORDER } from '../types';

// Reducer for handling all actions
export default function reducer(state: IOrdersUpdate = {
  asks: [],
  bids: []
}, { type, payload }: any) {
  // The search request has been sent
  if (type === UPDATE_ORDER) {
    const { asks, bids } = payload;
    return { ...state, asks, bids };
  }
  return state;
}
