import React from 'react';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../services/api';
import collection from '../utils/collection';
import Table from '../components/Table';
import DepthChart from '../components/DepthChart';

const hasOrders = o => o.asks.length || o.bids.length;

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

    setTimeout(() => {
      this.setState({ query: 'btc_mxn' });
    }, 5000);

    setTimeout(() => {
      this.setState({ query: 'eth_mxn' });
    }, 10000);
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
    const { asks, bids } = this.state;

    return (
      <div className="container">
        <section className="row justify-content-center mt-5 mb-5">
          { hasOrders({ asks, bids }) && <DepthChart orders={{ asks, bids }} /> }
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
