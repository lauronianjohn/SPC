// All Users-related Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

Meteor.publish('users.all', function() {
    return Meteor.users.find({});
});

Meteor.publish('users.list', function(options) {
    return Meteor.users.find({}, options);
});

Meteor.publish('users.search', function(keyword, options) {
    return Meteor.users.find({
        'profile.role.role': { 
            $ne: "Super Administrator" 
        },
        'profile.deletedAt': { 
            $eq: null
        },
        deletedAt: null,
        $or: [
            {
                'profile.firstName': {
                    $regex: ".*" + keyword + ".*",
                    $options: "i"
                }
            }, 
            {
                'profile.lastName': {
                    $regex: ".*" + keyword + ".*",
                    $options: "i"
                } 
            }
        ]
    }, options);
});