import React from 'react';
import uuid from 'uuid/v4';
import api from '../services/api';
import './App.css';

const items = i => (
  <p key={uuid()}>{ `${i.price} - ${i.amount}` }</p>
);

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      asks: [],
      bids: [],
    };
  }

  componentDidMount() {
    const getOrders = api.getOrderBook('btc_mxn');

    getOrders
      .then(response => response.data.payload)
      .then(data => this.setState({ ...data }));
  }

  render() {
    const { asks, bids } = this.state;

    return (
      <div>
        Orders go here
        <div>
          {asks && asks.map(items)}
          <h3>Asks</h3>
        </div>
        <div>
          <h3>Bids</h3>
          {bids && bids.map(items)}
        </div>
      </div>
    );
  }
}

export default App;
