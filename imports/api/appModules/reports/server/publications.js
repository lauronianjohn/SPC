// Publications related to Reports Module

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { HistogramData } from '/imports/api/collections/histogramData/histogramData.js';
import { PerItemTestResults } from '/imports/api/collections/perItemTestResults/perItemTestResults.js';
import { PerSampleTestResults } from '/imports/api/collections/perSampleTestResults/perSampleTestResults.js';

Meteor.publish('perItemTestResults.overall', function() {
    return PerItemTestResults.find({});
});

Meteor.publish('histogramData.overall', function() {
    return HistogramData.find({});
});

Meteor.publish('candlestickData.withInTimePeriod', function() {
    return PerSampleTestResults.find({});
});