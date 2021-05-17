 
d3.csv("https://kyohe1.github.io/siVofnI2021/W08/data.csv")
    .then(data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });
        
        var config = {
            parent: '#drawing_region',
            width: 1200,
            height: 800,
            margin: { top: 30, right: 10, bottom: 40, left: 80 }
        };

        const lineChart = new LineChart(config, data);
        lineChart.update();
    })
    .catch(error => {
        console.log(error);
    });


class LineChart {

    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 1200,
            height: config.height || 800,
            margin: config.margin || { top: 10, right: 10, bottom: 10, left: 50 },
            axis_margin: 10
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
          .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.area = d3.area()
            .x( d => self.xscale(d.x))
            .y1( d => self.yscale(d.y))
            .y0(self.inner_height  - 3*self.config.axis_margin);
        console.log( self.inner_height  - d3.max( self.data, d => d.y ));
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(6)
            .tickSize(5)
            .tickPadding(1);    

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(12)
            .tickSize(5)
            .tickPadding(1);    
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, 0)`);

    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin-self.config.axis_margin/2, xmax+self.config.axis_margin/2] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymax+self.config.axis_margin, ymin-self.config.axis_margin] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("path")
            .data(self.data)
            .enter()
            .append("path")
            .attr('d', self.area(self.data))
            .attr('stroke', 'red')
            .attr('fill', 'orange');

        self.chart.selectAll("circle") 
           .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .attr('fill', 'red');

        self.chart.append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width / 2)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .attr("font-size", "30pt")
            .text("Area Plot");

        self.xaxis_group
            .call(self.xaxis)
            .append("text")
            .attr("fill", "black")
            .attr("x", self.inner_width / 2)
            .attr("y", 40)
            .attr("text-anchor", "middle")
            .attr("font-size", "20pt")
            .text("X-Axis");

        self.yaxis_group
            .call(self.yaxis)
            .append("text")
            .attr("fill", "black")
            .attr("x", -self.inner_height / 2)
            .attr("y", -50)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("font-size", "20pt")
            .text("Y-Axis");
    }
}
