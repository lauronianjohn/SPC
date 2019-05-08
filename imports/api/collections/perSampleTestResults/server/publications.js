// All PerSampleTestResults-related Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { PerSampleTestResults } from '../perSampleTestResults.js';

Meteor.publish('perSampleTestResults.all', function(options) {
    return PerSampleTestResults.find({}, options);
});