d3.csv("https://kyohe1.github.io/siVofnI2021/W04/prefectures.csv")
  .then((data) => {
    const extData = data.filter(
      (d) => d.year == "2021" && d.month == "4" && d.date == "18"
    );

    var config = {
      parent: "#drawing_region",
      width: 2000,
      height: 1500,
      margin: { top: 30, right: 10, bottom: 40, left: 100 },
      tgtVal: Object.assign([], data).sort(
        (a, b) => -a.testedPositive - -b.testedPositive
      )[0]["testedPositive"],
    };

    const barChart = new BarChart(config, extData);

    d3.select("#Nomal").on("click", () => {
      barChart.update(Object.assign([], extData));
    });

    d3.select("#Reverse").on("click", () => {
      barChart.update(Object.assign([], extData).reverse());
    });

    d3.select("#Ascending").on("click", () => {
      barChart.update(
        Object.assign([], extData).sort(
          (a, b) => a.testedPositive - b.testedPositive
        )
      );
    });

    d3.select("#Descending").on("click", () => {
      barChart.update(
        Object.assign([], extData).sort(
          (a, b) => -a.testedPositive - -b.testedPositive
        )
      );
    });

  })
  .catch((error) => {
    console.log(error);
  });

class BarChart {
  constructor(config, data) {
    this.config = {
      parent: config.parent,
      width: config.width || 256,
      height: config.height || 512,
      margin: config.margin || { top: 10, right: 10, bottom: 10, left: 30 },
      tgtVal: config.tgtVal || 0,
    };
    this.data = data;
    this.init();
  }

  init() {
    let self = this;

    self.svg = d3
      .select(self.config.parent)
      .attr("width", self.config.width)
      .attr("height", self.config.height);

    self.chart = self.svg
      .append("g")
      .attr(
        "transform",
        `translate(${self.config.margin.left}, ${self.config.margin.top})`
      );

    self.inner_width =
      self.config.width - self.config.margin.left - self.config.margin.right;

    self.inner_height =
      self.config.height - self.config.margin.top - self.config.margin.bottom;

    self.xscale = d3.scaleLinear().range([0, self.inner_width]);

    self.xaxis = d3.axisBottom(self.xscale).ticks(25).tickSizeOuter(0);

    self.xaxis_group = self.chart
      .append("g")
      .attr("transform", `translate(0, ${self.inner_height})`);

    self.yscale = d3
      .scaleBand()
      .range([0, self.inner_height])
      .paddingInner(0.1);

    self.yaxis = d3.axisLeft(self.yscale).tickSizeOuter(0);

    self.yaxis_group = self.chart.append("g");

    self.update(self.data);
  }

  update(updatedData) {
    let self = this;
    self.data = updatedData;
    self.xscale.domain([
      0,
      d3.max(self.data, (d) => parseInt(d.testedPositive) + 2000),
    ]);
    self.yscale.domain(self.data.map((d) => d.prefectureNameE));
    self.render();
  }

  render() {
    let self = this;
    self.chart
      .selectAll("rect")
      .data(self.data)
      .join("rect")
      .transition()
      .duration(1000)
      .attr("x", 0)
      .attr("y", (d) => self.yscale(d.prefectureNameE))
      .attr("width", (d) => self.xscale(parseInt(d.testedPositive)))
      .attr("height", self.yscale.bandwidth())
      .attr("fill", (d) =>
        d3.interpolate(
          "orange",
          "red"
        )(parseInt(d.testedPositive) / self.config.tgtVal)
      );

    self.xaxis_group
      .call(self.xaxis)
      .append("text")
      .attr("fill", "black")
      .attr("x", self.inner_width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .attr("font-size", "10pt")
      .text("Tested Positive");

    self.yaxis_group
      .call(self.yaxis)
      .append("text")
      .attr("fill", "black")
      .attr("x", -self.inner_height / 2)
      .attr("y", -80)
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "10pt")
      .text("Prefectures");
  }
}
