import * as React from 'react';
import { connect } from 'react-redux';
import { IOrder, IOrdersUpdate } from '../../types';

import './index.css';

interface IOrdersProps {
  orders: IOrder[]
}

const Orders = ({ orders }: IOrdersProps) => {
  return orders ? (
    <>
      {orders.map(({ price, size }) => (<tr key={price}>
        <td>{price}</td>
        <td>{size}</td>
      </tr>))}
    </>
  ) : null;
}

const Asks = connect(({ asks: orders }: IOrdersUpdate) => ({ orders }))(Orders);
const Bids = connect(({ bids: orders }: IOrdersUpdate) => ({ orders }))(Orders);

const OrderBook = () => (<table className="order-book">
  <thead>
    <tr>
      <th className="order-book-header">BTC/USD</th>
    </tr>
    <tr>
      <th className="order-column-header">Price</th>
      <th className="order-column-header">Size</th>
    </tr>
  </thead>
  <tbody>
    <Bids />
    <Asks />
  </tbody>
</table>);

export default OrderBook;
