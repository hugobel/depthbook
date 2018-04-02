import * as d3 from 'd3';
import _ from 'lodash';

class Chart {
  constructor(target) {
    this.container = target;

    this.setDimensions();
    this.setTransitions();
    this.drawScene();
  }

  get canvas() {
    return this.renderedCanvas();
  }

  renderedCanvas() {
    return this.scene;
  }

  draw(orders) {
    this.orders = orders;

    this.setLimits();
    this.setScales();
    this.setGraphicLimit();

    this.drawOrdersArea('asks');
    this.drawOrdersArea('bids');
    this.drawAxes();
  }

  setDimensions() {
    this.dimensions = {
      width: 980,
      height: 520,
    };

    this.margins = {
      top: 40,
      right: 60,
      bottom: 50,
      left: 60,
    };
  }

  setTransitions() {
    this.transitions = d3.transition().duration(250);
  }

  setLimits() {
    const lowestPrice = Number(_.last(this.orders.bids)[0]);
    const highestPrice = Number(_.last(this.orders.asks)[0]);

    this.midpoint = (Number(this.orders.asks[0][0]) + Number(this.orders.bids[0][0])) / 2;

    const midpointDiff = Math.max((this.midpoint - lowestPrice), (highestPrice - this.midpoint));
    const topValue = Math.max(_.last(this.orders.asks)[2], _.last(this.orders.bids)[2]);

    this.limits = {
      left: this.midpoint - midpointDiff,
      right: this.midpoint + midpointDiff,
      top: topValue * 1.1,
    };
  }

  setGraphicLimit() {
    const asksBase = [
      this.orders.asks[0][0],
      null,
      0,
    ];

    const asksHighest = [
      this.limits.right,
      null,
      _.last(this.orders.asks)[2],
    ];

    const bidsBase = [
      this.orders.bids[0][0],
      null,
      0,
    ];

    const bidsLowest = [
      this.limits.left,
      null,
      _.last(this.orders.bids)[2],
    ];

    this.asks = [asksBase, ...this.orders.asks, asksHighest];
    this.bids = [bidsBase, ...this.orders.bids, bidsLowest];
  }

  setScales() {
    this.xScale = d3
      .scaleLinear()
      .domain([this.limits.left, this.limits.right])
      .range([this.margins.left + 1, this.dimensions.width - this.margins.right]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, this.limits.top])
      .range([this.dimensions.height - this.margins.top - this.margins.bottom, 0]);
  }

  drawScene() {
    this.scene = d3
      .select(this.container)
      .append('svg')
      .attr('width', this.dimensions.width)
      .attr('height', this.dimensions.height)
      .attr('class', 'chart');
  }

  defineShapes() {
    const area = d3.area()
      .x(d => this.xScale(d[0]))
      .y1(d => this.yScale(d[2]))
      .y0(this.yScale(0))
      .curve(d3.curveStepAfter);

    const line = d3.line()
      .x(d => this.xScale(d[0]))
      .y(d => this.yScale(d[2]))
      .curve(d3.curveStepAfter);

    this.shapes = { area, line };
  }

  defineAxes() {
    const left = d3.axisLeft(this.yScale).ticks(5, 's').tickSizeOuter(0);
    const right = d3.axisRight(this.yScale).ticks(5, 's').tickSizeOuter(0);
    const bottom = d3.axisBottom(this.xScale).ticks(10, 's').tickSizeOuter(0);

    this.axes = { left, right, bottom };
  }

  drawAxes() {
    this.defineAxes();
    const { left, right, bottom } = this.axes;

    this.scene
      .append('g')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
      .attr('class', 'axis axis-left')
      .call(left);

    this.scene
      .append('g')
      .attr('transform', `translate(${this.dimensions.width - this.margins.right}, ${this.margins.top})`)
      .attr('class', 'axis axis-right')
      .call(right);

    this.scene
      .append('g')
      .attr('transform', `translate(0, ${this.dimensions.height - this.margins.bottom})`)
      .attr('class', 'axis axis-bottom')
      .call(bottom);
  }

  updateAxes() {
    this.defineAxes();
    const { left, right, bottom } = this.axes;

    d3.select('.axis-left')
      .transition(this.transitions)
      .call(left);

    d3.select('.axis-right')
      .transition(this.transitions)
      .call(right);

    d3.select('.axis-bottom')
      .transition(this.transitions)
      .call(bottom);
  }

  drawOrdersArea(type) {
    this.defineShapes();
    const { area, line } = this.shapes;

    this.scene
      .append('path')
      .datum(this[type])
      .attr('class', `chart-area chart-area--${type}`)
      .attr('d', area)
      .attr('transform', `translate(0, ${this.margins.top})`);

    this.scene
      .append('path')
      .datum(this[type])
      .attr('class', `chart-line chart-line--${type}`)
      .attr('d', line)
      .attr('transform', `translate(0, ${this.margins.top})`);
  }

  updateOrdersArea(type) {
    this.defineShapes();
    const { area, line } = this.shapes;

    d3.select(`.chart-area--${type}`)
      .transition(this.transitions)
      .attr('d', () => area(this[type]));

    d3.select(`.chart-line--${type}`)
      .transition(this.transitions)
      .attr('d', () => line(this[type]));
  }

  update(orders) {
    this.orders = orders;

    d3.selectAll('*').interrupt();

    this.setLimits();
    this.setScales();
    this.setGraphicLimit();

    this.updateOrdersArea('asks');
    this.updateOrdersArea('bids');
    this.updateAxes();
  }
}


export default Chart;
