// All PerItemTestResults-related Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { PerItemTestResults } from '../perItemTestResults.js';

Meteor.publish('perItemTestResults.all', function() {
    return PerItemTestResults.find({});
});