import * as React from 'react';
import Midpoint from './Midpoint';
import { Asks, Bids } from './Orders';

import './index.css';

const OrderBook = () => (<table className="order-book">
  <thead className="order-book-header">
    <tr>
      <th colSpan={2} className="currency-pair">BTC/USD</th>
    </tr>
    <tr>
      <th className="order-column-header">Price</th>
      <th className="order-column-header">Size</th>
    </tr>
  </thead>
  <tbody className="order-boook-body">
    <Bids />
    <Midpoint />
    <Asks />
  </tbody>
</table>);

export default OrderBook;
