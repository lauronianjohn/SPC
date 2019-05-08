// All AppModules Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { AppModules } from '../appModules.js';

Meteor.publish('appModules.all', function() {
    return AppModules.find({});
});