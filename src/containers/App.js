import React from 'react';
import Pusher from 'pusher-js';
import collection from '../utils/collection';
import DepthChart from '../components/DepthChart';
import Table from '../components/Table';

const hasOrders = o => o.asks.length > 0 || o.bids.length > 0;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      asks: [],
      bids: [],
    };
  }

  componentDidMount() {
    const pusher = new Pusher('de504dc5763aeef9ff52');
    const orderBookChannel = pusher.subscribe('order_book');

    orderBookChannel.bind('data', (data) => {
      this.setState({
        asks: collection.appendCumulative(data.asks),
        bids: collection.appendCumulative(data.bids),
      });
    });
  }

  render() {
    const { asks, bids } = this.state;

    return (
      <div className="container">
        <section className="row justify-content-center mt-5 mb-2">
          <h3>Depth Chart (USD/BTC)</h3>
        </section>
        <section className="row justify-content-center mt-2 mb-5">
          { hasOrders({ asks, bids }) && <DepthChart orders={{ asks, bids }} /> }
        </section>
        <div className="row justify-content-around small">
          <Table label="Posturas de compra" orders={bids} type="bids" />
          <Table label="Posturas de venta" orders={asks} type="asks" />
        </div>
      </div>
    );
  }
}

export default App;
