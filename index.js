var tip = d3
  .select(".chart-container")
  .append("div")
  .attr("class", "tip")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden");

var svg = d3.select("svg").attr("class", "background-style"),
  margin = { top: 20, right: 20, bottom: 42, left: 40 },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.05),
  y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg
  .append("g")
  .attr(
    "transform",
    "translate(" + (margin.left + 20) + "," + margin.top + ")"
  );

d3.json("data.json", function (error, data) {
  data = data.data;

  x.domain(
    data.map(function (d) {
      return d.country;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.population;
    }),
  ]);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .attr("y", 6)
    .attr("dy", "2.5em")
    .attr("dx", width / 2 - margin.left)
    .attr("text-anchor", "start")
    .text("Country");

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10))
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("Population");

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.country);
    })
    .attr("y", function (d) {
      return y(d.population);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.population);
    })

    .on("mouseover", function (d) {
      return tip
        .text(d.population)
        .style("visibility", "visible")
        .style("top", y(d.population) - 13 + "px")
        .style("left", x(d.country) + x.bandwidth() - 12 + "px");
    })
    .on("mouseout", function () {
      return tip.style("visibility", "hidden");
    });
});
