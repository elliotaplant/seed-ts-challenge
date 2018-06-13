import {applyMiddleware, combineReducers, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import promise from 'redux-promise-middleware';
import reducer from './reducers/order';

// Create the redux store for the app to consume
const middleware = composeWithDevTools(applyMiddleware(promise()));
const store = createStore(reducer, middleware);

export default store;
