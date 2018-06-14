import * as React from 'react';
import { connect } from 'react-redux';
import { IOrder, IOrdersUpdate } from '../../types';

import './index.css';

interface IOrdersProps {
  orders: IOrder[]
}

const Orders = ({ orders }: IOrdersProps) => {
  return orders ? (
    <div>
      {orders.map(({ price, size }) => <div key={price}>Price: {price}, Size: {size}</div>)}
    </div>
  ) : null;
}

const Asks = connect(({ asks: orders }: IOrdersUpdate) => ({ orders }))(Orders);
const Bids = connect(({ bids: orders }: IOrdersUpdate) => ({ orders }))(Orders);

const OrderBook = () => (<div className="order-book">
  <div className="order-book-header">BTC/USD</div>
  Bids: <Bids />
  Asks: <Asks />
</div>);

export default OrderBook;
