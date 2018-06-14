import { createAction } from 'redux-actions';
import { IOrdersUpdate } from '../../types';
import { UPDATE_ORDER } from '../types';

const updateOrders = (data: IOrdersUpdate) => data;

export const updateOrdersAction = createAction(UPDATE_ORDER, updateOrders);
