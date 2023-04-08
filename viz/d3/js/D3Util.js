import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
//https://www.npmjs.com/package/d3
//http://using-d3js.com/

export class D3Util {
  static readCSV = async (url) => {
    const data = await d3.csv(url);
    return data;
  };

  static getDataText = async (url, options) => {
    const results = await fetch(url, options);
    if (results?.ok) return results.text();
    else return null;
  };

  static getData = async (url, options) => {
    const results = await fetch(url, options);
    if (results?.ok) return results.json();
    else return null;
  };


  // https://blog.risingstack.com/d3-js-tutorial-bar-charts-with-javascript/
  // https://jsfiddle.net/matehu/w7h81xz2/
  static barChart = (
    id,
    data,
    xCol,
    yCol,
    xLabel,
    yLabel,
    width = 1000,
    height = 600,
    margin = 60,
    yMin = 0,
    yMax = 100
  ) => {
    const w = width - 2 * margin;
    const h = height - 2 * margin;
    const svg = d3.select(id);

    // The <g> SVG element is a container used to group other SVG elements.
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Element/g

    const chart = svg
      .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

    // ===== Y Axis =====
    // scaling and axes
    // here  the lowest and the highest value limit which in this case are 0(yMin) and 100(yMax)
    // scaleLinear : converts a continuous input domain (range) into a continuous output range (domain)
    const yScale = d3.scaleLinear().range([h, 0]).domain([yMin, yMax]);

    // create axis on the left  as adding another group and
    // calling d3’s axisLeft method with the scaling function as a parameter.
    chart.append("g").call(d3.axisLeft(yScale));

    // ===== For X-axis =====
    const xScale = d3
      .scaleBand()
      .range([0, w])
      .domain(data.map((s) => s[xCol]))
      .padding(0.2);

    chart
      .append("g")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom(xScale));

    // render rectangles

    chart
      .selectAll()
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (s) => xScale(s[xCol]))
      .attr("y", (s) => yScale(s[yCol]))
      .attr("height", (s) => h - yScale(s[yCol]))
      .attr("width", xScale.bandwidth());

    // gird lines x axis
    chart
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${h})`)
      .call(d3.axisBottom().scale(xScale).tickSize(-h, 0, 0).tickFormat(""));

    // grid lines y axis
    chart
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft().scale(yScale).tickSize(-w, 0, 0).tickFormat(""));

    // labels
    svg
      .append("text")
      .attr("x", -(h / 2) - margin)
      .attr("y", margin / 2.4)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .text(yLabel);

    svg
      .append("text")
      .attr("x", w / 2 + margin)
      .attr("y", 40)
      .attr("text-anchor", "middle")
      .text(xLabel);

    /*
    svg.on('mouseenter',  (actual, i) => {
        d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (s) => xScale(s[xCol]) - 5)
        .attr('width', xScale.bandwidth() + 10)

        chart.append('line')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', width)
        .attr('y2', y)
        .attr('stroke', 'red')

    })
    .on('mouseleave', (actual, i) => {
        d3.select(this).attr('opacity', 1)
    })
    */
  };
}
