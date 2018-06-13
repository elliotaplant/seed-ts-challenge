import {createAction} from 'redux-actions';
import {UPDATE_ORDER} from '../types';

const sequesterOrders = (orders: any) => {
  return orders.reduce((sequestered, order) => {
    if (!sequestered.has(order.price)) {
      sequestered.set(order.price, 0);
    }
    const currentSize = sequestered.get(order.price);
    sequestered.set(order.price, currentSize + 1);
    return sequestered;
  }, new Map());
};

// TODO: add "midpoint"
const orderSequesters = (sequesteredOrders) => {
  return Array.from(sequesteredOrders)
    .map(([price, size]) => ({ price, size }))
    .sort(({price: a}, {price: b}) => (a > b ? 1 : (a < b ? -1 : 0)));
}

const updateOrder = (newData) => {
  // TODO: use a websocket for this
  // update the orders in the store.
  const sequesteredOrders = sequesterOrders(newData);
  const sortedOrders = orderSequesters(sequesteredOrders);
  return {orders: sortedOrders};
}

export const updateOrdersAction = createAction(UPDATE_ORDER, updateOrder);
