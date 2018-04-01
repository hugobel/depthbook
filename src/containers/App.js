import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import collection from '../utils/collection';
import Table from '../components/Table';
import DepthChart from '../components/DepthChart';

import './App.css';

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
      .then(collection.parseInitData)
      .then(orders => this.setState({ ...orders }));

    const websocket = new WebSocket('wss://ws.bitso.com');

    websocket.onopen = () => {
      websocket.send(JSON.stringify({ action: 'subscribe', book: 'btc_mxn', type: 'orders' }));
    };

    websocket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      console.log(data);
    };
  }

  render() {
    const {
      asks,
      bids,
      asksAggregate,
      bidsAggregate,
    } = this.state;

    return (
      <div className="container">
        <section className="row justify-content-center mt-5 mb-5">
          <DepthChart orders={{ asks: asksAggregate, bids: bidsAggregate }} />
        </section>
        <div className="row justify-content-around">
          <Table label="Posturas de compra" orders={bids} />
          <Table label="Posturas de venta" orders={asks} />
        </div>
      </div>
    );
  }
}

export default App;
