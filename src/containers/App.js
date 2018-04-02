import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import collection from '../utils/collection';
import config from '../utils/config';

import OptionGroup from '../components/OptionGroup';
import DepthChart from '../components/DepthChart';
import Table from '../components/Table';

const hasOrders = o => o.asks.length > 0 || o.bids.length > 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      asks: [],
      bids: [],
      book: '',
      query: this.props.book,
    };

    this.requestBook = this.requestBook.bind(this);
  }

  componentDidMount() {
    this.requestBook(this.props.book);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.book !== nextState.book || nextState.query;
  }

  componentDidUpdate() {
    if (this.state.query) this.requestBook(this.state.query);
  }

  requestBook(book) {
    api
      .getOrderBook(book)
      .then(response => response.data.payload)
      .then(data => ({
        asks: collection.appendCumulative(data.asks),
        bids: collection.appendCumulative(data.bids),
      }))
      .then(data => this.setState({
        book,
        ...data,
        query: null,
      }));
  }

  render() {
    const { asks, bids, book } = this.state;
    const navParams = {
      options: config.BOOKS,
      current: book,
      onChange: this.requestBook,
    };

    return (
      <div className="container">
        <section className="row justify-content-center mt-5 mb-5">
          { hasOrders({ asks, bids }) && <DepthChart orders={{ asks, bids }} /> }
        </section>
        <section className="row justify-content-center mt-5 mb-5">
          <OptionGroup {...navParams} />
        </section>
        <div className="row justify-content-around small">
          <Table label="Posturas de compra" orders={bids} type="bids" />
          <Table label="Posturas de venta" orders={asks} type="asks" />
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
