// Types to be used in the app
export interface IOrder {
  price: string;
  size: string;
}
export interface IMidpoint {
  midpoint: number;
  spread: number;
  midpointDelta: number;
}
export interface IOrdersUpdate {
  orders: {
    asks: IOrder[];
    bids: IOrder[];
  },
  midpoint: IMidpoint;
}
