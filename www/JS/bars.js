/* Project Biosensors - Jenko Schneider Stickel Tung */

var svg;

// Dimensions of chart and margin
var chartWidth = 1220;
var chartHeight = 300;
const margin = {top: 30, right: 30, bottom: 80, left: 50};

document.addEventListener("DOMContentLoaded", function(event) {
     // Specify columns that should be used as data for x and y
     colx = "Time";

     // Create SVG and place it correctly
     svg = d3.select("#plot")
          .append("svg")
          .attr("width", chartWidth + margin.left + margin.right)
          .attr("height", chartHeight + margin.top + margin.bottom)
          .attr("class", "chart")
          .append("g")
          .attr("transform","translate(" + margin.left + "," + margin.top + ")");

     // X axys
     svg.append("g")
          .attr("id", "XWithLabel")
          .attr("transform", "translate(0," + chartHeight + ")")

     svg.append("text")
          .attr("id", "XVariable")
          .attr("text-anchor", "end")
          .attr("x", chartWidth)
          .attr("y", chartHeight+margin.top+40);

     // Y axys
     svg.append("g")
          .attr("id", "YWithLabel")

     svg.append("text")
          .attr("id", "YVariable")
          .attr("text-anchor", "start")
          .attr("x",-40)
          .attr("y", -10)


     // avg line and text
     svg.append("line")
          .attr("id", "AverageLineChart")
          .attr("class", "avgLine")
          .attr("x1",0)
          .attr("x2", chartWidth)
          .style("visibility", "hidden");

     svg.append("line")
          .attr("id", "avgLine")
          .attr("class", "avgLine")
          .attr("x1", chartWidth-130)
          .attr("x2", chartWidth-90)
          .attr("y1", -15)
          .attr("y2", -15)
          .style("visibility", "hidden");

     svg.append("text")
          .attr("id", "AverageLineText")
          .attr('x', (chartWidth-40))
          .attr("y", -10)
          .attr("text-anchor", "middle")
});

//Type = "bar", "line"
function DrawGraph(dataset, coly, type, dateFormat)
{
     dataset = dataset["data"];

     // Find minimum and maximum value for our y attribute, as well as the average
     let ymin = Infinity;
     let ymax = -Infinity;
     let sum = 0;

     for (row=0;row<dataset.length;row++){ 
          if(dataset[row][coly] < ymin){
               ymin = dataset[row][coly]
          }
          if(dataset[row][coly] > ymax){
               ymax = dataset[row][coly]
          }
          sum += parseInt(dataset[row][coly])
     }
     
     let avg = sum/dataset.length;


     // Define axes
     let textX = d3.scaleBand()
          .domain(dataset.map(function(d) { return DateToString(d[colx], dateFormat); }))
          .range([0,chartWidth]);

     let scaleX = d3.scaleBand()
          .domain(dataset.map(function(d) { return d[colx]; }))
          .range([0,chartWidth]);

     let scaleY = d3.scaleLinear()
          .domain([ymin-10, ymax])
          .range([chartHeight,0]);
     
     
     // Add x axis with label (can be rotated if too long)        
     d3.select("#XWithLabel")
          .call(d3.axisBottom(textX))
          .selectAll("text")
               .style("text-anchor", "end")
               .attr("dx", "-.8em")
               .attr("dy", ".15em")
               .attr("transform","rotate(-30)"); // can be left out for short values

     d3.select("#XVariable")
          .text("Time");

     // Add y axis with label        
     d3.select("#YWithLabel")
          .call(d3.axisLeft(scaleY));

     d3.select("#YVariable")
          .text(coly);


     // Define diverging colorscale    
     var divColor = d3.scaleLinear()
          .domain([ymin, avg, ymax])
          .range(["purple", "white","orange"])
          .interpolate(d3.interpolateRgb); 


     // Define tooltip and its functions
     let tooltip = d3.select("#tooltip")
          .style("visibility", "hidden");

     function mouseOver (event,d){
          d3.select(event.currentTarget)
          tooltip
               .style("visibility","visible")
               .style("width", chartWidth+margin.left+margin.right)
               .text(Math.round(d[coly]*100)/100)
     }

     function mouseOut (event,d){
          tooltip
          .style("visibility","hidden")
          }

     function mouseClick (event,d){
          d3.select(event.currentTarget)
          tooltip
               .style("visibility","visible")
               .style("width", chartWidth+margin.left+margin.right)
               .text("Add description, more info etc.")
     }


     // Add bars
     d3.selectAll(".bars").remove()

     if(type=="bar")
     {
          svg.selectAll("bars")
               .data(dataset)
               .enter()
               .append("rect")
               .attr("class", function(d) {return "bars"})
               .attr("x", function(d){return scaleX(d[colx]);})
               .attr("y", function(d) {return scaleY(d[coly]);})
               .attr("width",scaleX.bandwidth())
               .attr("height",function(d){return chartHeight - scaleY(d[coly]);})
               .attr("fill", function(d) { return divColor(d[coly]);})
               .on("mouseover",mouseOver)
               .on("mouseout",mouseOut)
               .on("click",mouseClick);


          // Add line at average with legend
          let plotAvg = scaleY(avg)
          svg.select("#AverageLineChart")
               .attr("y1", plotAvg)
               .attr("y2", plotAvg);

          svg.select("#AverageLineText")
               .text("Average: "+ Math.round(avg*100)/100);


          d3.selectAll(".avgLine").raise().style("visibility", "visible");
     }


     // Add line
     d3.selectAll(".line").remove()

     if(type=="line")
     {
          svg.selectAll("lines")
               .data([dataset], function(d){return d[coly]})
               .enter()
               .append("path")
               .attr("class", "line")
               .attr("d", d3.line()
                    .x(function(d){return scaleX(d[colx])+scaleX.bandwidth()/2;})
                    .y(function(d){return scaleY(d[coly]);}))
                    .attr("fill", "none");

          // Add line at average with legend
          let plotAvg = scaleY(avg)
          svg.select("#AverageLineChart")
               .attr("y1", plotAvg)
               .attr("y2", plotAvg);

          svg.select("#AverageLineText")
               .text("Average: "+ Math.round(avg*100)/100);


          d3.selectAll(".avgLine").raise().style("visibility", "visible");
     }
      
}