export interface IL2Snapshot {
    type: 'snapshot'
    product_id: string
    bids: Array<[string, string]> // strings are serialized fixed-point numbers
    asks: Array<[string, string]>
}

export interface IL2Update {
    type: 'l2update'
    product_id: string
    changes: Array<[string, string, string]> // [side, price, new size]
}

export type WebsocketMessage = IL2Snapshot | IL2Update;
