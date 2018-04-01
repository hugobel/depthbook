import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import Chart from '../services/chart';

import './DepthChart.css';

const hasOrders = o => o.asks.length || o.bids.length;

class DepthChart extends React.Component {
  render() {
    const { orders } = this.props;
    const container = this.props.connectFauxDOM('div', 'chart');

    if (!hasOrders(orders)) return 'Loading';

    const chart = new Chart({ container, orders });

    return chart.canvas.node().toReact();
  }
}

DepthChart.defaultProps = {
  orders: {},
  connectFauxDOM: () => {},
};

DepthChart.propTypes = {
  orders: PropTypes.shape({
    asks: PropTypes.array,
    bids: PropTypes.array,
  }),
  connectFauxDOM: PropTypes.func,
};

export default withFauxDOM(DepthChart);
