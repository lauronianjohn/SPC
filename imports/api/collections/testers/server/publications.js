// All Testers-related Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { Testers } from '../testers.js';

Meteor.publish('testers.all', function() {
    return Testers.find({}, {
        fields: {
            _id: 1,
            name: 1
        }
    });
});