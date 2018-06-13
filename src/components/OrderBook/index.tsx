import * as React from 'react';
import {connect} from 'react-redux';
import './index.css';

// Maybe get the ticker for each order book?
const OrderBook = ({orders}: any) => (<div className="order-book">
  <div className="order-book-header">BTC/USD</div>
  {orders.map((order: any) => <div key={order.price}>Price: {order.price}, Size: {order.size}</div>)}
</div>);

export default connect(({orders}: any) => ({orders}))(OrderBook);
