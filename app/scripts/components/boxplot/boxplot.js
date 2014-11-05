
'use strict';

var scripts = document.getElementsByTagName('script');
var currentScriptPath = scripts[scripts.length-1].src;

function iqr(k) {
  return function(d) {
    var q1 = d.quartiles[0],
        q3 = d.quartiles[2],
        iqr = (q3 - q1) * k,
        i = -1,
        j = d.length;
    while (d[++i] < q1 - iqr) {}
    while (d[--j] > q3 + iqr) {}
    return [i, j];
  };
}


function boxplotDirectiveLink(scope, element, attrs) {
  var MIN = 0;
  var MAX = 4;

  var fivenum = attrs.fivenum.split(',').map(Number);

  var margin = {top: 30, right: 50, bottom: 70, left: 50};
  var width  = 400 - margin.left - margin.right;
  var height = 400 - margin.top  - margin.bottom;

  var data = [];
	data[0] = [];

	// add here the header of the csv file
	data[0][0] = 'Q1';
	// add more rows if your csv file has more columns

	data[0][1] = [];

  console.log(attrs);
  fivenum.forEach(function (value) {
    data[0][1].push(value);
  });

  var min = fivenum[MIN];
  var max = fivenum[MAX];

	var chart = d3.box()
		.whiskers(iqr(1.5))
		.height(height)
		.domain([min, max])
		.showLabels(true);

	var svg = d3.select(element.find('svg')[0])
		.attr('width', width + margin.left + margin.right)
		.attr('height', height + margin.top + margin.bottom)
		.attr('class', 'box')
		.append('g')
		.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

	// the x-axis
	var x = d3.scale.ordinal()
		.domain( data.map(function(d) { console.log(d); return d[0]; } ) )
		.rangeRoundBands([0 , width], 0.7, 0.3);

// 	var xAxis = d3.svg.axis()
// 		.scale(x)
// 		.orient('bottom');

	// the y-axis
	var y = d3.scale.linear()
		.domain([min, max])
		.range([height + margin.top, 0 + margin.top]);

	var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

	// draw the boxplots
	svg.selectAll('.box')
      .data(data)
	  .enter().append('g')
		.attr('transform', function(d) { return 'translate(' +  x(d[0])  + ',' + margin.top + ')'; } )
      .call(chart.width(x.rangeBand()));

	// add a title
	svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 + (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        //.style('text-decoration', 'underline')
        .text('Here goes the name');

	 // draw y axis
	svg.append('g')
        .attr('class', 'y axis')
        .call(yAxis);
}

var boxplotDirective = function () {
  return {
    restrict: 'E',
    templateUrl: currentScriptPath.replace('.js', '.html'),
    scope: {
      fivenum: '@'
    },
    link: boxplotDirectiveLink
  };
};

angular.module('boxplot', [])
  .directive('boxplot', boxplotDirective);