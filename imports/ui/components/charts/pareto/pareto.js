import './pareto.html';

var chart;

Template.Pareto.rendered = function () {
    var data = [{
        x: 'Issues 1',
        value: 65
    },
    {
        x: 'Issues 2',
        value: 109
    },
    {
        x: 'Issues 3',
        value: 12.5
    },
    {
        x: 'Issues 4',
        value: 45
    },
    {
        x: 'Issues 5',
        value: 250
    },
    {
        x: 'Issues 6',
        value: 27
    },
    {
        x: 'Issues 7',
        value: 35
    },
    {
        x: 'Issues 8',
        value: 170
    },
    {
        x: 'Issues 9',
        value: 35
    },
    {
        x: 'Issues 10',
        value: 35
    }
    ];

    // create pareto chart with data
    var chart = anychart.pareto(data);
    // set chart title text settings
    chart.title('Pareto Chart of Issues');
    // set measure y axis title
    chart.yAxis(0).title('Defect frequency');
    // cumulative percentage y axis title
    chart.yAxis(1).title('Cumulative Percentage');
    // turn on chart animation
    chart.animation(true);

    // create horizontal line marker
    chart.lineMarker()
        .value(80)
        .axis(chart.yAxis(1))
        .stroke('#A5B3B3', 1, '5 2', 'round'); // sets stroke

    // get pareto column series and set settings
    var column = chart.getSeriesAt(0);
    column.tooltip().format('Value: {%Value}');

    // get pareto line series and set settings
    var line = chart.getSeriesAt(1);
    line.seriesType('spline')
        .markers(true);
    line.yScale().ticks().interval(10);
    line.labels()
        .enabled(true)
        .anchor('right-bottom')
        .format('{%CF}%');
    line.tooltip().format('Cumulative Frequency: {%CF}% \n Relative Frequency: {%RF}%');

    // turn on the crosshair and set settings
    chart.crosshair()
        .enabled(true)
        .xLabel(false);

    // set container id for the chart
    chart.container('pareto');
    // initiate chart drawing
    chart.draw();
};
