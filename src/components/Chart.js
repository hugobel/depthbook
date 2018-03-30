import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { withFauxDOM } from 'react-faux-dom';

import './Chart.css';

class Chart extends React.Component {
  componentDidMount() {
    const faux = this.props.connectFauxDOM('div', 'chart');

    const data = [4, 8, 15, 16, 23, 39];

    const x = d3.scaleLinear()
      .domain([0, d3.max(data)])
      .range([0, 420]);

    d3.select(faux)
      .classed('chart', true)
      .selectAll('div')
      .data(data)
      .enter()
      .append('div')
      .style('width', d => `${x(d)}px`)
      .text(d => d);
  }

  render() {
    return (
      <div>
        {this.props.chart}
      </div>
    );
  }
}

Chart.defaultProps = {
  chart: 'loading',
  connectFauxDOM: () => {},
};

Chart.propTypes = {
  chart: PropTypes.element,
  connectFauxDOM: PropTypes.func,
};

export default withFauxDOM(Chart);
