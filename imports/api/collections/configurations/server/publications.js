// All Configurations-related Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { Configurations } from '../configurations.js';

Meteor.publish('configurations.all', function() {
    return Configurations.find({});
});

Meteor.publish('dateRange', function() {
    return Configurations.find({
        createdAt: {
            $lte: new Date(),
            $gte: new Date()
        }
    });
});