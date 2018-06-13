import { IOrders } from './gdax-types';

export interface IAppState {
  asks: IOrders;
  bids: IOrders;
}
