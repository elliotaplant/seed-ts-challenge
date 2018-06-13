export interface IOrder {
  usd: number;
  btc: number;
}
export interface IChange {
  side: string;
  price: number;
  newSize: number ;
}

export interface IL2Snapshot {
  type: 'snapshot'
  product_id: string
  bids: IOrder;
  asks: IOrder;
}

export interface IL2Update {
  type: 'l2update'
  product_id: string
  changes: IChange;
}

export type WebsocketMessage = IL2Snapshot | IL2Update;
