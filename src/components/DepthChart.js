import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import Chart from '../services/chart';

class DepthChart extends React.Component {
  constructor(props) {
    super(props);
    const target = props.connectFauxDOM('div');

    this.state = {
      chart: new Chart(target),
      orders: props.orders,
    };
  }

  shouldComponentUpdate(nextProps) {
    this.state.chart.update(nextProps.orders);
    return false;
  }

  render() {
    const { chart, orders } = this.state;
    chart.draw(orders);

    return this.state.chart.canvas.node().toReact();
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
