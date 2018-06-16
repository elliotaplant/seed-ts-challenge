import * as React from 'react';
import { Fragment } from 'react';
import { connect } from 'react-redux';
import { IOrder, IOrdersUpdate } from '../../../types';
import { splitDigits } from '../../../utils';
import './index.css';

interface IOrdersProps {
  orders: IOrder[];
  className: 'ask' | 'bid';
}

// Price table data component
const Price = ({ price }: { price: string }) => {
  const {significant, insignificant} = splitDigits(price, 8);
  return (
    <Fragment>
      <span className="significant">{significant}</span>
      <span className="insignificant">{insignificant}</span>
    </Fragment>
  );
}

// Size table data component
const Size = ({ size }: { size: string }) => {
  const {significant, insignificant} = splitDigits(size, 8);
  return (
    <Fragment>
      <span className="significant">{significant}</span>
      <span className="insignificant">{insignificant}</span>
    </Fragment>
  );
}

// Generic order row Component
const Order = ({ orders, className }: IOrdersProps) => {
  return orders ? (
    <Fragment>
      {orders.map(({ price, size }) => (<tr key={price}>
        <td className={`order-data price ${className}`}><Price price={price} /></td>
        <td className={`order-data size ${className}`}><Size size={size} /></td>
      </tr>))}
    </Fragment>
  ) : null;
}

export const Asks = connect(({ orders: { asks: orders }}: IOrdersUpdate) => ({ orders, className: 'ask' }))(Order);
export const Bids = connect(({ orders: { bids: orders }}: IOrdersUpdate) => ({ orders, className: 'bid' }))(Order);
