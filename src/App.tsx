import * as React from 'react';
import Websocket from 'react-websocket';
import './App.css';
import OrderBook from './components/OrderBook';
import handleSocketUpdate from './handleSocketUpdate';

// Main App class to gather subcomponents
const App = () => (<div className="app">
  <Websocket url="ws://127.0.0.1:3030" onMessage={handleSocketUpdate} />
  <OrderBook />
</div>
);

export default App;
