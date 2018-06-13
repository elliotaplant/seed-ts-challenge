import { createAction } from 'redux-actions';
import { IL2Snapshot, IL2Update } from '../../gdax-types';
import { SNAPSHOT, UPDATE } from '../types';

const snapshot = (data: IL2Snapshot) => data;

export const snapshotAction = createAction(SNAPSHOT, snapshot);

const update = (data: IL2Update) => data;

export const updateAction = createAction(UPDATE, update);
