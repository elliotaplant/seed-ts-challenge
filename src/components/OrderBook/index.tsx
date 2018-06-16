import * as React from 'react';
import './index.css';
import Midpoint from './Midpoint';
import { Asks, Bids } from './Orders';

// OrderBookHeader component
const OrderBookHeader = () => (
  <thead className="order-book-header">
    <tr>
      <th colSpan={2} className="currency-pair">BTC/USD</th>
    </tr>
    <tr>
      <th className="order-column-header">Price</th>
      <th className="order-column-header">Size</th>
    </tr>
  </thead>
);

// Component to display entire OrderBook
const OrderBook = () => (<table className="order-book">
  <OrderBookHeader />
  <tbody className="order-boook-body">
    <Asks />
    <Midpoint />
    <Bids />
  </tbody>
</table>);

export default OrderBook;
