import * as React from 'react';
import {connect} from 'react-redux';
import './index.css';

// Maybe get the ticker for each order book?
const OrderBook = ({asks, bids}: any) => (<div className="order-book">
  <div className="order-book-header">BTC/USD</div>
  {asks && asks.map((order: any) => <div key={order.price}>Price: {order.price}, Size: {order.size}</div>)}
</div>);

export default connect(({asks, header}: any) => ({asks, header}))(OrderBook);
