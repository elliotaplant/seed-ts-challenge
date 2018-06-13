import * as React from 'react';
import {connect} from 'react-redux';
import Header from './components/Header';
import OrderBook from './components/OrderBook';
import {updateOrdersAction} from './store/actions/order';

// Main App class to gather subcomponents
class App extends React.Component {
  public render() {
    return(<div className="app">
      <Header />
      <OrderBook />
    </div>)
  }
}

export default connect(null, (dispatch) => ({
  updateData: (newData: any) => dispatch(updateOrdersAction(newData))
}))(App);
