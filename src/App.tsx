import * as React from 'react';
import {connect} from 'react-redux';
import {connectToApiSocket} from './client';
import Header from './components/Header';
import OrderBook from './components/OrderBook';
import GdaxSocket from './GdaxSocket';
import {updateOrdersAction} from './store/actions/order';

// Main App class to gather subcomponents
class App extends React.Component {

  public componentDidMount() {
    const apiClient = new GdaxSocket(
      (data) => console.log('data', data),
      (error) => console.error(error),
      () => console.log('Socket closed')
    );
  }

  public render() {
    return(<div className="app">
      <Header />
      <OrderBook />
    </div>)
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateData: (newData) => dispatch(updateOrdersAction(newData))
});
export default connect(null, mapDispatchToProps)(App);
