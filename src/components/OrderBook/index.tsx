import * as React from 'react';
import {connect} from 'react-redux';
import {ordersAsList} from '../../utils';

import './index.css';

// Maybe get the ticker for each order book?
const OrderBook = ({asks, bids}: any) => (<div className="order-book">
  <div className="order-book-header">BTC/USD</div>
  Bids:
  {console.log('bids', bids) || bids && ordersAsList(bids).map(({price, size}: any, index: number) => (
    <div key={index}>Price: {price}, Size: {size}</div>
  ))}
  Asks:
  {asks && ordersAsList(asks).map(({price, size}: any, index: number) => (
    <div key={index}>Price: {price}, Size: {size}</div>
  ))}
</div>);

export default connect(({asks, bids}: any) => ({asks, bids}))(OrderBook);
