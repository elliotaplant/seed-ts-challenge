import * as React from 'react';
import Websocket from 'react-websocket';
import Header from './components/Header';
import OrderBook from './components/OrderBook';

import handleSocketUpdate from './handleSocketUpdate';


// Main App class to gather subcomponents
const App = () => (<div className="app">
  <Websocket url="ws://127.0.0.1:1337" onMessage={handleSocketUpdate} />
  <Header />
  <OrderBook />
</div>
);

export default App;
