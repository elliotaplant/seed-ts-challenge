import { IOrdersUpdate } from '../../types';
import { UPDATE_ORDER } from '../types';

// Reducer for handling all actions
export default function reducer(state: IOrdersUpdate = {
  midpoint: {
    midpoint: 0,
    midpointDelta: 0,
    spread: 0,
  },
  orders: {
    asks: [],
    bids: [],
  },
}, { type, payload }: any) {
  // The only action we are resolving is UPDATE_ORDER, so we can spread the entire payload
  if (type === UPDATE_ORDER) {
    return { ...state, ...payload };
  }
  return state;
}
