import * as d3 from 'd3';
import _ from 'lodash';

class Chart {
  constructor(options) {
    this.container = options.container;
    this.orders = options.orders;

    this.setDimensions();
    this.drawScene();
    this.setLimits();
    this.setScales();
    this.setGraphicLimit();
    this.drawOrdersArea('asks');
    this.drawOrdersArea('bids');
    this.drawAxes();
  }

  get canvas() {
    return this.renderedCanvas();
  }

  renderedCanvas() {
    return this.scene;
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

  setLimits() {
    const lowestPrice = Number(_.last(this.orders.bids).price);
    const highestPrice = Number(_.last(this.orders.asks).price);

    this.midpoint = (Number(this.orders.asks[0].price) + Number(this.orders.bids[0].price)) / 2;

    const midpointDiff = Math.max((this.midpoint - lowestPrice), (highestPrice - this.midpoint));
    const topValue = Math.max(_.last(this.orders.asks).sum, _.last(this.orders.bids).sum);

    this.limits = {
      left: this.midpoint - midpointDiff,
      right: this.midpoint + midpointDiff,
      top: topValue * 1.1,
    };
  }

  setGraphicLimit() {
    const asksBase = {
      price: this.orders.asks[0].price,
      sum: 0,
    };

    const asksHighest = {
      price: this.limits.right,
      sum: _.last(this.orders.asks).sum,
    };

    const bidsBase = {
      price: this.orders.bids[0].price,
      sum: 0,
    };

    const bidsLowest = {
      price: this.limits.left,
      sum: _.last(this.orders.bids).sum,
    };

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

  drawAxes() {
    const leftAxis = d3.axisLeft(this.yScale).ticks(5, 's').tickSizeOuter(0);
    const rightAxis = d3.axisRight(this.yScale).ticks(5, 's').tickSizeOuter(0);
    const bottomAxis = d3.axisBottom(this.xScale).ticks(10, 's').tickSizeOuter(0);

    this.scene
      .append('g')
      .attr('transform', `translate(${this.margins.left}, ${this.margins.top})`)
      .call(leftAxis);

    this.scene
      .append('g')
      .attr('transform', `translate(${this.dimensions.width - this.margins.right}, ${this.margins.top})`)
      .call(rightAxis);

    this.scene
      .append('g')
      .attr('transform', `translate(0, ${this.dimensions.height - this.margins.bottom})`)
      .call(bottomAxis);
  }

  drawOrdersArea(type) {
    const area = d3.area()
      .x(d => this.xScale(d.price))
      .y1(d => this.yScale(d.sum))
      .y0(this.yScale(0))
      .curve(d3.curveStepAfter);

    const line = d3.line()
      .x(d => this.xScale(d.price))
      .y(d => this.yScale(d.sum))
      .curve(d3.curveStepAfter);


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
}


export default Chart;
