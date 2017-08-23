'use strict';

let graphWidth = Math.floor(window.innerWidth * 0.6);
let graphHeight = Math.floor(window.innerWidth * 0.4);
let padding = Math.floor(window.innerWidth / 20);

let xScale = d3.scaleTime()
    .range([padding, graphWidth - padding]);

let yScale = d3.scaleLinear()
    .range([padding, graphHeight - padding]);

let xAxis = d3.axisBottom(xScale)
    .ticks(5);

let yAxis = d3.axisLeft(yScale);

let tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([0, 0])
    .html(function(d) {
    let date = dateFormat(new Date(d[0]), "mmmm - yyyy");
    let gross = d[1].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1,`);
    return `<div> <h3 class='date'> $ ${gross} Billion </h3> <h5 class='date'> ${date} </h5> </div>`;
    });

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(error, data) {
    let barWidth = (graphWidth - padding * 2) / data.data.length;

    let yMax = d3.max(data.data, d => d[1]);
    yMax = Math.ceil(yMax / 2000) * 2000;
    yScale.domain([yMax, 0]);

    let xMin = new Date(d3.min(data.data, d => d[0]));
    let xMax = new Date(d3.max(data.data, d => d[0]));
    xScale.domain([xMin, xMax]);

    var bar = d3.select('#chart').append('svg')
        .attr('width', graphWidth)
        .attr('height', graphHeight);

    bar.call(tip);
    bar.selectAll('rect')
        .data(data.data)
        .enter()
        .append('rect')
        .attr('height', function (d) {
            return (graphHeight - (padding * 2)) / (yMax / d[1]);
        })
    .attr('width', barWidth)
    .attr('y', function (d) {
        return (graphHeight - padding) - ((graphHeight - (padding * 2)) / (yMax / d[1]));
    })
    .attr('x', function (d, i) {
        return i * barWidth + padding;
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide);

    bar.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${graphHeight - padding})`)
        .call(xAxis);

    bar.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${padding})`)
        .call(yAxis);

    bar.append('text')
        .text('United States Gross Domestic Product')
        .attr('class', 'title')
        .attr('transform', `translate(${graphWidth * 0.5}, ${graphHeight * 0.08})`);

    bar.append('text')
       .text('Year')
       .attr('class', 'axis-label')
       .attr('transform', `translate(${graphWidth * 0.5}, ${graphHeight * 0.98})`);

    bar.append('text')
        .text('GDP in Billions')
        .attr('class', 'axis-label')
        .attr('transform', `translate(${graphWidth * 0.02}, ${graphHeight * 0.5}), rotate(-90)`);

});