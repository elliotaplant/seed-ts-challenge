export interface IOrders { [price: string]: string }; // price: size

export interface IChanges {
  buy: IOrders;
  sell: IOrders;
}

export interface IL2Snapshot {
  type: 'snapshot'
  product_id: string
  bids: IOrders;
  asks: IOrders;
}

export interface IL2Update {
  type: 'l2update'
  product_id: string
  changes: IChanges;
}

export type WebsocketMessage = IL2Snapshot | IL2Update;
