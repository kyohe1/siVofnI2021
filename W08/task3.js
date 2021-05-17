
d3.csv("https://kyohe1.github.io/siVofnI2021/W04/prefectures.csv")
    .then(data => {
        var extData = data.filter(d => d.year == "2021" && d.month == "4" && d.date == "18")
            .sort((a, b) => -a.testedPositive - -b.testedPositive); // Sort descending

        var top5Data = extData.slice(0, 5); // Extract top 5

        var other = {
            date: "18",
            deaths: "0",
            discharged: "0",
            effectiveReproductionNumber: "0",
            hospitalized: "0",
            month: "4",
            peopleTested: "0",
            prefectureNameE: "Others",
            prefectureNameJ: "その他",
            serious: "0",
            testedPositive: String(d3.sum(extData.slice(5), d => d.testedPositive)),
            year: "2021"
        };

        var config = {
            parent: '#drawing_region',
            width: 1024,
            height: 1024,
            radius: Math.min(1024, 1024) / 2,
            margin: { top: 30, right: 10, bottom: 40, left: 130 }
        };

        top5Data.push(other)
        
        const pieChart = new PieChart(config, top5Data);
        pieChart.update();
    })
    .catch(error => {
        console.log(error);
    });


class PieChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            radius: config.radius || Math.min(width, height) / 2,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 30 },
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.width / 2}, ${self.config.height / 2})`);

        self.pie = d3.pie()
            .value(d => parseInt(d.testedPositive))
            .sort(null);

    }

    update() {
        let self = this;
        self.arc = d3.arc()
            .innerRadius(self.config.radius/2.5)
            .outerRadius(self.config.radius);
        self.render();
    }

    render() {
        let self = this;
        var color = d3.scaleOrdinal()
            .range(["#DC3912", "#3366CC", "#109618", "#FF9900", "#990099","#202020"]);
        var positiveSum  = d3.sum(self.data, d => d.testedPositive);
        self.chart.selectAll("pie")
            .data(self.pie(self.data))
            .enter()
            .append("path")
            .attr('d', self.arc)
            .attr("fill", d => color(d.index))
            .attr('stroke', 'white')
            .style('stroke-width', '2px');

        self.chart.selectAll("pie")
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .text(d => d.data.prefectureNameE  + ": "+ String(Math.round(d.value/ positiveSum* 1000) / 10) + "%")
            .attr('transform', d => `translate(${self.arc.centroid(d)})`)
            .attr("fill", "white")
            .style("text-anchor", "middle");
        
        self.chart.selectAll("g")
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .text("Total Tested Positive Number: " + String(positiveSum))
            .attr("dx", "-10px")
            .attr('transform', `translate(${self.config.width / 64}, ${self.config.height / 64})`)
            .style("text-anchor", "middle")
            .attr("font-size", "20px")
    }
 
}
