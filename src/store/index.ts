import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducer from './reducers/order';

// Create the redux store for the app to consume
const store = createStore(reducer, composeWithDevTools());

export default store;
