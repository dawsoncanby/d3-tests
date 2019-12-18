class Bars {

  constructor(svgId, className) {
    this.svgId = svgId;
    this.className = className;
    this.backgroundColor = '#222';
  }

  loadData(data, labels) {
    this.data = data.map(e => { return parseFloat(e.toFixed(2)); });
    this.labels = labels
  }

  setupDimensions(width, height) {
    this.padX = 20;
    this.padY = 40;
    this.barSpacing = (height - (2 * this.padY)) / this.data.length * 0.5;
    this.barHeight = ((height - (2 * this.padY)) - (this.data.length * this.barSpacing)) / this.data.length;
    this.textOffsetX = 2;
    this.textOffsetY = 2;

    this.barWidth = d3.scaleLinear()
      .domain([0, d3.max(this.data)])
      .range([this.padX, width - this.padX]);

    this.barY = (i) => {
      return i * (this.barHeight + this.barSpacing) + this.padY;
    };

    this.xAxis = d3.axisBottom().scale(this.barWidth);
  }

  render(width, height) {
    this.setupDimensions(width, height);

    let svg = d3.select('#' + this.svgId);
    svg.selectAll('*').remove();

    svg = svg.append('g')
      .attr('class', this.className);

    // background
    svg.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', this.backgroundColor);

    // bars
    svg.selectAll('bars')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', this.padX)
      .attr('y', (d, i) => {
        return this.barY(i);
      })
      .attr('width', (d) => {
        return this.barWidth(d) - this.padX;
      })
      .attr('height', this.barHeight)
      .attr('fill', '#fff');

    // labels
    svg.selectAll('labels')
      .data(this.labels)
      .enter()
      .append('text')
      .html((d, i) => {
        return d;
      })
      .attr('x', this.padX + this.textOffsetX)
      .attr('y', (d, i) => {
        return this.barY(i) - this.textOffsetY;
      });

    // x axis
    svg.append('g')
      .attr('transform', `translate(0,${height - this.padY})`)
      .call(this.xAxis);

    // y axis
    // TODO: maybe make this a real axis
    svg.append('line')
      .attr('x1', this.padX)
      .attr('x2', this.padX)
      .attr('y1', height - this.padY)
      .attr('y2', this.padY);
  }
}
