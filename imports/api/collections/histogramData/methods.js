// Methods related to HistogramData Collection

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { HistogramData } from './histogramData.js';

Meteor.methods({
    'histogramData.insertMany': function(histogramDataArray) {
        try {
            histogramDataArray.forEach(function(histogramData) {
                histogramData.forEach(function(perHistogramData) {
                    HistogramData.insert({
                        bin: perHistogramData.bin,
                        binRange: perHistogramData.binRange,
                        binCount: perHistogramData.binCount,
                        sampleItem: perHistogramData.sampleItem,
                        createdAt: new Date()
                    });
                });
            });
        } catch(error) {
            throw new Meteor.Error('error', error.error);
        }
    }
});