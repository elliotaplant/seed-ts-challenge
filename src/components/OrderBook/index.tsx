import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { IOrder, IOrdersUpdate } from '../../types';
import { splitDigits } from '../../utils';

import './index.css';

interface IOrdersProps {
  orders: IOrder[]
}

const Price = ({ price }: { price: string }) => {
  const {significant, unsignificant} = splitDigits(price, 8);
  return (
    <Fragment>
      <span className="significant">{significant}</span>
      <span className="unsignificant">{unsignificant}</span>
    </Fragment>
  );
}

const Size = ({ size }: { size: string }) => {
  const {significant, unsignificant} = splitDigits(size, 8);
  return (
    <Fragment>
      <span className="significant">{significant}</span>
      <span className="unsignificant">{unsignificant}</span>
    </Fragment>
  );
}

const Orders = ({ orders }: IOrdersProps) => {
  return orders ? (
    <Fragment>
      {orders.map(({ price, size }) => (<tr key={price}>
        <td className="order-data price"><Price price={price} /></td>
        <td className="order-data size"><Size size={size} /></td>
      </tr>))}
    </Fragment>
  ) : null;
}

const Asks = connect(({ asks: orders }: IOrdersUpdate) => ({ orders }))(Orders);
const Bids = connect(({ bids: orders }: IOrdersUpdate) => ({ orders }))(Orders);

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
    <tr><td colSpan={2} className="order-data margin">Margin</td></tr>
    <Asks />
  </tbody>
</table>);

export default OrderBook;
