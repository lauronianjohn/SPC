import './yield.html';

// Helpers
import { formatDataForYieldChart } from '/lib/helpers.js';

// Meteor Package(s)
import { Session } from 'meteor/session';
import { Tracker } from 'meteor/tracker';

// Mongo Collection(s)
import { Configurations } from '/imports/api/collections/configurations/configurations.js';

// Overall Items
import { calculateOverallItems } from '/lib/overall-calculator.js';

// Yield Chart
const yieldChart = anychart.line();
// Global Var for Yield Chart Data
var yieldChartDataOverall = [];
var yieldChartDataPerSample = [];
var yieldChartDataType;

/*
 * Creates Yield Chart
 * @param data
*/
export const createYield = function createYield(data, type) {
    yieldChartDataType = type;
    yieldChart.removeAllSeries();

    // Identify the type of data to display on chart
    if(type == "per sample") {
        yieldChartDataPerSample = data;

        if(yieldChartDataPerSample.chartData) {
            yieldChart.yScale()
            .minimum(yieldChartDataPerSample.yScale.min)
            .maximum(yieldChartDataPerSample.yScale.max);

            yieldChart.xAxis().labels().format('{%Value}{type:time}');
            yieldChart.yAxis().labels().format('{%Value}%');

            yieldChart.tooltip().titleFormat('{%x}{type:datetime}');
            yieldChart.tooltip().format('{%value}%');

            // yieldChart.title('Yield Chart');
            yieldChart.container('yield-chart');
            
            var series = yieldChart.spline(yieldChartDataPerSample.chartData);
            series.stroke('#0000FF');
            series.name('Yield');

            var legend = yieldChart.legend();
            legend.enabled(true)
                .position('bottom');

            yieldChart.draw();
        }
    } else {
        yieldChartDataOverall = data;

        if(yieldChartDataOverall.chartData) {
            yieldChart.yScale()
            .minimum(yieldChartDataOverall.yScale.min)
            .maximum(yieldChartDataOverall.yScale.max);
            
            yieldChart.xAxis().labels().format('{%Value}{type:datetime}');
            yieldChart.yAxis().labels().format('{%Value}%');

            // yieldChart.labels().enabled(true);
            yieldChart.tooltip().titleFormat('{%x}{type:datetime}');
            yieldChart.tooltip().format('{%value}%');
            // yieldChart.tooltip().format('{%value}{decimalsCount:1}%');

            // yieldChart.title('Yield Chart');
            yieldChart.container('yield-chart');
            
            var series = yieldChart.spline(yieldChartDataOverall.chartData);
            series.stroke('#0000FF');
            series.name('Yield');

            var legend = yieldChart.legend();
            legend.enabled(true)
                .position('bottom');

            yieldChart.draw();
        }
    }
}

Template.Yield.onCreated(function() {
    // Identify the type of data to display on chart
    if(yieldChartDataType == "per sample") {
        createYield(yieldChartDataPerSample, yieldChartDataType);
    } else {
        Tracker.autorun(() => {
            // Subscription(s)
            var configSubscription = Meteor.subscribe('configurations.all');
            Meteor.subscribe('perItemTestResults.all');
    
            if(configSubscription.ready()) {
                Session.set('configuration', Configurations.findOne());
    
                var configuration = Session.get('configuration');
                var overallItemsCalculation = calculateOverallItems(configuration);
                var overallItems = overallItemsCalculation.items;
                var yieldChartData = {
                    yScale: {
                        min: 0,
                        max: 100
                    },
                    chartData: formatDataForYieldChart(configuration, overallItems)
                };
    
                yieldChartDataOverall = yieldChartData;
                yieldChartDataType = "overall";
    
                createYield(yieldChartDataOverall, yieldChartDataType);
            }
        });
    }
});

Template.Yield.onRendered(function() {
    var yieldChartData;
    
    // Identify the type of data to display on chart
    if(yieldChartDataType == "per sample") {
        yieldChartData = yieldChartDataPerSample;
    } else {
        yieldChartData = yieldChartDataOverall;
    }

    createYield(yieldChartData, yieldChartDataType);
});