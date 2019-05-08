// Publications related to Reports Module

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { HistogramData } from '../histogramData.js';

Meteor.publish('histogram.all', function() {
    return HistogramData.find({});
});