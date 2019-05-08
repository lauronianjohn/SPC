import './xbar.html';

// Helpers
import { formatDataForAnyCharts } from '/lib/helpers.js';
import { setLimit } from '/lib/helpers.js';

// Meteor Package(s)
import { Tracker } from 'meteor/tracker';

// Mongo Collection(s)
import { Configurations } from '/imports/api/collections/configurations/configurations.js';

// Overall Items
import { calculateOverallItems } from '/lib/overall-calculator.js';

// X-bar Chart
const xBarChart = anychart.line();
// Global Var for X-bar Chart Data
var xBarChartDataOverall = [];
var xBarChartDataPerSample = [];
var xBarChartDataType;

/*
 * Creates X-bar Chart
 * @param data
*/
export const createXBar = function createXBar(data, type) {
    xBarChartDataType = type;
    xBarChart.removeAllSeries();
    // Identify the type of data to display on chart
    if(type == "per sample") {
        xBarChartDataPerSample = data;
        
        if(xBarChartDataPerSample.chartData) {
            xBarChart.yScale()
            .minimum(xBarChartDataPerSample.yScale.min)
            .maximum(xBarChartDataPerSample.yScale.max);
            
            xBarChart.xAxis().labels().format('{%Value}{type:datetime}');
            xBarChart.tooltip().titleFormat('{%x}{type:datetime}');

            // xBarChart.title('X-bar Chart');
            xBarChart.container('x-bar-chart');
            
            var series = xBarChart.line(xBarChartDataPerSample.chartData);
            series.stroke('#0000FF');
            series.name('Measurement');

            // Upper Control Limit
            var series2 = xBarChart.line(xBarChartDataPerSample.ucl);
            series2.stroke('#FFFF00');
            series2.name('Upper Control Limit');
            // Lower Control Limit
            var series3 = xBarChart.line(xBarChartDataPerSample.lcl);
            series3.stroke('#FFFF00');
            series3.name('Lower Control Limit');

            // Upper Specification Limit
            var series4 = xBarChart.line(xBarChartDataPerSample.usl);
            series4.stroke('#FF0000');
            series4.name('Upper Specification Limit');
            // Lower Specification Limit
            var series5 = xBarChart.line(xBarChartDataPerSample.lsl);
            series5.stroke('#FF0000');
            series5.name('Lower Specification Limit');

            var legend = xBarChart.legend();
            legend.enabled(true)
                .position('bottom');

            xBarChart.draw();
        }
    } else {
        xBarChartDataOverall = data;

        if(xBarChartDataOverall.chartData) {
            xBarChart.yScale()
            .minimum(xBarChartDataOverall.yScale.min)
            .maximum(xBarChartDataOverall.yScale.max);
            
            xBarChart.xAxis().labels().format('{%Value}{type:datetime}');
            xBarChart.tooltip().titleFormat('{%x}{type:datetime}');

            // xBarChart.title('X-bar Chart');
            xBarChart.container('x-bar-chart');
            
            var series = xBarChart.line(xBarChartDataOverall.chartData);
            series.stroke('#0000FF');
            series.name('Measurement');

            // Upper Control Limit
            var series2 = xBarChart.line(xBarChartDataOverall.ucl);
            series2.stroke('#FFFF00');
            series2.name('Upper Control Limit');
            // Lower Control Limit
            var series3 = xBarChart.line(xBarChartDataOverall.lcl);
            series3.stroke('#FFFF00');
            series3.name('Lower Control Limit');

            // Upper Specification Limit
            var series4 = xBarChart.line(xBarChartDataOverall.usl);
            series4.stroke('#FF0000');
            series4.name('Upper Specification Limit');
            // Lower Specification Limit
            var series5 = xBarChart.line(xBarChartDataOverall.lsl);
            series5.stroke('#FF0000');
            series5.name('Lower Specification Limit');

            var legend = xBarChart.legend();
            legend.enabled(true)
                .position('bottom');

            xBarChart.draw();
        }
    }
}

Template.X_bar.onCreated(function() {
    // Identify the type of data to display on chart
    if(xBarChartDataType == "per sample") {
        createXBar(xBarChartDataPerSample, xBarChartDataType);
    } else {
        Tracker.autorun(() => {
            // Subscription(s)
            var configSubscription = Meteor.subscribe('configurations.all');
            Meteor.subscribe('perItemTestResults.all');
    
            if(configSubscription.ready()) {
                Session.set('configuration', Configurations.findOne());

                var configuration = Session.get('configuration');
                var overallItemsCalculation = calculateOverallItems(configuration);
                var chartData = formatDataForAnyCharts(overallItemsCalculation.items);
                var xBarChartData = {
                    yScale: {
                        min: overallItemsCalculation.minimum,
                        max: (overallItemsCalculation.maximum > configuration.specLimit.upperSpecLimit) ? overallItemsCalculation.maximum : configuration.specLimit.upperSpecLimit
                    },
                    chartData: chartData,
                    ucl: setLimit(chartData, configuration.controlLimit.upperControlLimit),
                    lcl: setLimit(chartData, configuration.controlLimit.lowerControlLimit),
                    usl: setLimit(chartData, configuration.specLimit.upperSpecLimit),
                    lsl: setLimit(chartData, configuration.specLimit.lowerSpecLimit),
                };
    
                xBarChartDataOverall = xBarChartData;
                xBarChartDataType = "overall";
    
                createXBar(xBarChartDataOverall, xBarChartDataType);
            }
        });
    }
});

Template.X_bar.onRendered(function() {
    var xBarChartData;
    
    // Identify the type of data to display on chart
    if(xBarChartDataType == "per sample") {
        xBarChartData = xBarChartDataPerSample;
    } else {
        xBarChartData = xBarChartDataOverall;
    }

    createXBar(xBarChartData, xBarChartDataType);
});