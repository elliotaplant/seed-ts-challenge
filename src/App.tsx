import * as React from 'react';
import Header from './components/Header';
import OrderBook from './components/OrderBook';

// Main App class to gather subcomponents
const App = () => (<div className="app">
  <Header />
  <OrderBook />
</div>
);

export default App;
