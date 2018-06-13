import { IAppState } from '../../types';
import { mergeChanges } from '../../utils';
import { SNAPSHOT, UPDATE } from '../types';

// Reducer for handling all actions
export default function reducer(state: IAppState = {
  asks: {},
  bids: {}
}, { type, payload }: any) {
  // The search request has been sent
  if (type === SNAPSHOT) {
    const { asks, bids } = payload;
    return { ...state, asks, bids };
  } else if (type === UPDATE) {
    const { changes } = payload;

    const asks = mergeChanges(state.asks, changes.sell);
    const bids = mergeChanges(state.bids, changes.buy);

    return { ...state, asks, bids };
  }
  return state;
}
