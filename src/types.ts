export interface IOrder {
  price: string;
  size: string;
}
export interface IOrdersUpdate {
  asks: IOrder[];
  bids: IOrder[];
}
