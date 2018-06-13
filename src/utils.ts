import {IOrders} from './gdax-types';

export function ordersAsList(orders: IOrders) {
  return Object.keys(orders)
    .map(price => ({ price: +price, size: orders[price] }))
    .sort(({price: a}, {price: b}) => a > b ? 1 : (a < b ? -1 : 0));
}
