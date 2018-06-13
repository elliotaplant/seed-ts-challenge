import {IOrders} from './gdax-types';

export function ordersAsList(orders: IOrders) {
  return Object.keys(orders)
    .map(price => ({ price: +price, size: orders[price] }))
    .sort(({price: a}, {price: b}) => a > b ? 1 : (a < b ? -1 : 0));
}

export function mergeChanges(orders: IOrders, changes: IOrders): IOrders {
  // Merge all the orders together
  const allOrders = { ...orders, ...changes };

  // Remove orders with 0 size
  return ordersAsList(allOrders)
    .filter(({size}) => size !== '0')
    .reduce((mergedOrders, {price, size}) => {
      mergedOrders[price] = size;
      return mergedOrders;
    }, {});
}
