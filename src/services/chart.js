import * as d3 from 'd3';
import _ from 'lodash';

class Chart {
  constructor(options) {
    this.container = options.container;
    this.orders = options.orders;
    this.cumulative = options.cumulative;

    this.margin = 40;

    this.drawScene();
    this.setScales();
    this.drawAxes();
    this.drawOrdersArea('asks');
    this.drawOrdersArea('bids');
  }

  get canvas() {
    return this.renderedCanvas();
  }

  renderedCanvas() {
    return this.scene;
  }

  setScales() {
    const { asks, bids } = this.orders;

    this.xScale = d3
      .scaleLinear()
      .domain([_.last(bids).price, _.last(asks).price])
      .range([this.margin + 1, 960 - this.margin]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, _.last(this.cumulative.bids)])
      .range([420, 0]);
  }

  drawScene() {
    this.scene = d3
      .select(this.container)
      .append('svg')
      .attr('width', 960)
      .attr('height', 540);
  }

  drawAxes() {
    const leftAxis = d3.axisLeft(this.yScale).ticks(5);
    const rightAxis = d3.axisRight(this.yScale).ticks(5);

    this.scene
      .append('g')
      .attr('transform', `translate(${this.margin}, ${this.margin})`)
      .call(leftAxis);

    this.scene
      .append('g')
      .attr('transform', `translate(${960 - this.margin}, ${this.margin})`)
      .call(rightAxis);
  }

  drawOrdersArea(type) {
    const area = d3.area()
      .x(d => this.xScale(d.price))
      .y1((d, i) => this.yScale(this.cumulative[type][i]));

    area.y0(this.yScale(0)).curve(d3.curveStepAfter);

    this.scene
      .append('path')
      .datum(this.orders[type])
      .attr('fill', 'orange')
      .attr('d', area)
      .attr('transform', `translate(0, ${this.margin})`);
  }
}


export default Chart;
