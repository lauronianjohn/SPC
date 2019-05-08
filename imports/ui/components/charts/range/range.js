import './range.html';

// Helpers
import { formatDataForAnyCharts } from '/lib/helpers.js';
import { setLimit } from '/lib/helpers.js';

// Meteor Package(s)
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

// Mongo Collection(s)
import { Configurations } from '/imports/api/collections/configurations/configurations.js';

// Overall Items
import { calculateOverallItems } from '/lib/overall-calculator.js';

// range Chart
const rLineChart = anychart.line();
// Global Var for X-bar Chart Data
var rLineChartDataPersample = [];
var rLineChartDataOverall = [];
var rLineChartDataType;

/*
 * Creates R Line Chart
 * @param data
*/
export const createRline = function createRline(data, type) {
    rLineChart.removeAllSeries();
    rLineChartDataType = type;

    if(rLineChartDataType === 'per sample') {
        rLineChartDataPersample = data;
        if(rLineChartDataPersample.chartData) {
            rLineChart.yScale()
            .minimum(rLineChartDataPersample.yScale.min)
            .maximum(rLineChartDataPersample.yScale.max);
            
            rLineChart.xAxis().labels().format('{%Value}{type:datetime}');
            rLineChart.tooltip().titleFormat('{%x}{type:datetime}');

            // rLineChart.title('Range Chart');
            rLineChart.container('range-chart');
            
            var series = rLineChart.line(rLineChartDataPersample.chartData);
            series.stroke('#0000FF');
            series.name('Measurement');
    
            // Upper Control Limit
            var series2 = rLineChart.line(rLineChartDataPersample.ucl);
            series2.stroke('#FFFF00');
            series2.name('Upper Control Limit');
            // Lower Control Limit
            var series3 = rLineChart.line(rLineChartDataPersample.lcl);
            series3.stroke('#FFFF00');
            series3.name('Lower Control Limit');
    
             // Upper Specification Limit
             var series4 = rLineChart.line(rLineChartDataPersample.usl);
             series4.stroke('#FF0000');
             series4.name('Upper Specification Limit');
             // Lower Specification Limit
             var series5 = rLineChart.line(rLineChartDataPersample.lsl);
             series5.stroke('#FF0000');
             series5.name('Lower Specification Limit');
    
            var legend = rLineChart.legend();
            legend.enabled(true)
                .position('bottom');
    
            rLineChart.draw();
        }
    } else {
        rLineChartDataOverall = data;
        if(rLineChartDataOverall.chartData) {
            rLineChart.yScale()
            .minimum(rLineChartDataOverall.yScale.min)
            .maximum(rLineChartDataOverall.yScale.max);
            
            rLineChart.xAxis().labels().format('{%Value}{type:datetime}');
            rLineChart.tooltip().titleFormat('{%x}{type:datetime}');
            
            // rLineChart.title('Range Chart');
            rLineChart.container('range-chart');
            
            var series = rLineChart.line(rLineChartDataOverall.chartData);
            series.stroke('#0000FF');
            series.name('Measurement');
    
            // Upper Control Limit
            var series2 = rLineChart.line(rLineChartDataOverall.ucl);
            series2.stroke('#FFFF00');
            series2.name('Upper Control Limit');
            // Lower Control Limit
            var series3 = rLineChart.line(rLineChartDataOverall.lcl);
            series3.stroke('#FFFF00');
            series3.name('Lower Control Limit');
    
             // Upper Specification Limit
             var series4 = rLineChart.line(rLineChartDataOverall.usl);
             series4.stroke('#FF0000');
             series4.name('Upper Specification Limit');
             // Lower Specification Limit
             var series5 = rLineChart.line(rLineChartDataOverall.lsl);
             series5.stroke('#FF0000');
             series5.name('Lower Specification Limit');
    
            var legend = rLineChart.legend();
            legend.enabled(true)
                .position('bottom');
    
            rLineChart.draw();
        }
    }
}

Template.Range.onCreated(function() {
    if(rLineChartDataType === 'per sample') {
        createRline(rLineChartDataPersample, rLineChartDataType);
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
                var rLineChartData = {
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
    
                rLineChartDataOverall = rLineChartData;
                rLineChartDataType = "overall";
                createRline(rLineChartDataOverall, rLineChartDataType);
            } 
        });
    }
    // rLineChart.removeAllSeries();
    // createRline(rLineChartData);
});

Template.Range.onRendered(function () {
    var rLineChartData;
    
    // Identify the type of data to display on chart
    if(rLineChartDataType == "per sample") {
        rLineChartData = rLineChartDataPersample;
    } else {
        rLineChartData = rLineChartDataOverall;
    }

    createRline(rLineChartData, rLineChartDataType);
});