import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import collection from '../utils/collection';
import Table from '../components/Table';
import DepthChart from '../components/DepthChart';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      asks: [],
      bids: [],
      book: props.book,
    };
  }

  componentDidMount() {
    const getOrders = api.getOrderBook(this.state.book);

    getOrders
      .then(response => response.data.payload)
      .then(data => ({
        asks: collection.appendCumulative(data.asks),
        bids: collection.appendCumulative(data.bids),
      }))
      .then(data => this.setState({ ...data }));

    setTimeout(() => {
      this.setState({ book: 'btc_mxn' });
    }, 10000);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.book === prevState.book) return null;

    const getOrders = api.getOrderBook(this.state.book);

    getOrders
      .then(response => response.data.payload)
      .then(data => ({
        asks: collection.appendCumulative(data.asks),
        bids: collection.appendCumulative(data.bids),
      }))
      .then(data => this.setState({ ...data }));

    return null;
  }

  render() {
    const { asks, bids } = this.state;

    return (
      <div className="container">
        <section className="row justify-content-center mt-5 mb-5">
          <DepthChart orders={{ asks, bids }} />
        </section>
        <div className="row justify-content-around small">
          <Table label="Posturas de compra" orders={bids} />
          <Table label="Posturas de venta" orders={asks} />
        </div>
      </div>
    );
  }
}

App.defaultProps = {
  book: 'btc_mxn',
};

App.propTypes = {
  book: PropTypes.string,
};

export default App;
