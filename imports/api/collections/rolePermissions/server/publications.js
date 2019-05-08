// All RolePermissions Publications

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { RolePermissions } from '../rolePermissions.js';

Meteor.publish('rolePermissions.all', function() {
    return RolePermissions.find({});
});

Meteor.publish('rolePermissions.list', function(options) {
    return RolePermissions.find({
        'role.role': {
            $ne: "Super Administrator" 
        }
    }, options);
});

Meteor.publish('rolePermissions.search', function(keyword, options) {
    return RolePermissions.find({
        $and: [
            {
                'role.role': {
                    $ne: "Super Administrator" 
                }
            },
            {
                'role.role': {
                    $regex: ".*" + keyword + ".*",
                    $options: "i"
                }
            }
        ]
    }, options);
});