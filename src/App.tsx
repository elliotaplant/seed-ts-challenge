import * as React from 'react';
import Websocket from 'react-websocket';
import './App.css';
import OrderBook from './components/OrderBook';
import handleSocketUpdate from './handleSocketUpdate';

// Get the WebSocket url based on the environment
const wsUrl = process.env.NODE_ENV === 'development'
  ? 'ws://127.0.0.1:3030'
  : `wss://seed-ts-challenge.herokuapp.com/`;

// Main App class to gather subcomponents
const App = () => (<div className="app">
  <Websocket url={wsUrl} onMessage={handleSocketUpdate} />
  <OrderBook />
</div>
);

export default App;
