import * as d3 from 'd3';
import _ from 'lodash';

class Chart {
  constructor(options) {
    this.container = options.container;
    this.orders = options.orders;

    this.margin = 40;

    this.drawScene();
    this.setLimits();
    this.setScales();
    this.setGraphicLimit();
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

  setLimits() {
    const lowestPrice = Number(_.last(this.orders.bids).price);
    const highestPrice = Number(_.last(this.orders.asks).price);

    this.midpoint = (Number(this.orders.asks[0].price) + Number(this.orders.bids[0].price)) / 2;

    const midpointDiff = Math.max((this.midpoint - lowestPrice), (highestPrice - this.midpoint));
    const topValue = Math.max(_.last(this.orders.asks).sum, _.last(this.orders.bids).sum);

    this.limits = {
      left: this.midpoint - midpointDiff,
      right: this.midpoint + midpointDiff,
      top: topValue * 1.1, // Adds 10% to the end of the chart
    };
  }

  setGraphicLimit() {
    const asksHighest = {
      price: this.limits.right,
      sum: _.last(this.orders.asks).sum,
    };

    const bidsLowest = {
      price: this.limits.left,
      sum: _.last(this.orders.bids).sum,
    };

    this.asks = [...this.orders.asks, asksHighest];
    this.bids = [...this.orders.bids, bidsLowest];
  }

  setScales() {
    this.xScale = d3
      .scaleLinear()
      .domain([this.limits.left, this.limits.right])
      .range([this.margin + 1, 960 - this.margin]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, this.limits.top])
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
    const leftAxis = d3.axisLeft(this.yScale).ticks(5, 's');
    const rightAxis = d3.axisRight(this.yScale).ticks(5, 's');

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
      .y1(d => this.yScale(d.sum));

    area.y0(this.yScale(0)).curve(d3.curveStepAfter);

    this.scene
      .append('path')
      .datum(this[type])
      .attr('fill', 'orange')
      .attr('d', area)
      .attr('transform', `translate(0, ${this.margin})`);
  }
}


export default Chart;
