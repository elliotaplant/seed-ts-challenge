import {IChange, IOrders} from './gdax-types';

export function ordersAsList(orders: IOrders) {
  return Object.keys(orders)
    .map(price => ({ price, size: orders[price] }))
    .sort(({price: a}, {price: b}) => +a > +b ? 1 : (+a < +b ? -1 : 0));
}

export function mergeChanges(orders: IOrders, changes: IChange): IOrders {
  // Merge all the orders together
  const allOrders = { ...orders, ...changes.update };

  changes.delete.forEach(priceToDelete => {
    delete allOrders[priceToDelete];
  });

  // Remove orders with 0 size
  return allOrders;
}
