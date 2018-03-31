import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
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
    const getOrders = api.getOrderBook('xrp_mxn');

    getOrders
      .then(response => response.data.payload)
      .then(data => this.setState({ ...data }));
  }

  render() {
    const { asks, bids } = this.state;

    return (
      <div className="container">
        <section className="row justify-content-center mt-5 mb-5">
          <DepthChart orders={{ asks, bids }} />
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
