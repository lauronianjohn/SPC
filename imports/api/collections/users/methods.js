// Methods related to Users and UserProfiles Collection

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Mongo Collection(s)
import { UserProfiles } from './userProfiles.js';

Meteor.methods({
    'users.insert': function(userData) {
        check(userData, {
            username: String,
            emailAddress: String,
            password: String,
            userProfile: Object
        });
        
        // Validation of Data from the Client using the Collection's Schema
        UserProfiles.schema.validate(userData.userProfile);

        var currentUser = Meteor.user();
        // Get the current user's type and role for validating insertion purpose
        var currentUserType = currentUser.profile.type;
        var currentUserRole = currentUser.profile.role.role;
        
        if(currentUserType == "admin" && currentUserRole != "Super Administrator" && userData.userProfile.type == "admin") {
            throw new Meteor.Error("Create-error", "Admin can only create user-type user");
        } else {
            // The email address must be unique
            var userExists = Accounts.findUserByEmail(userData.emailAddress);
            if(!userExists) {
                return UserProfiles.insert({
                    firstName: userData.userProfile.firstName,
                    lastName: userData.userProfile.lastName,
                    address: userData.userProfile.address,
                    contactNo: userData.userProfile.contactNo,
                    type: userData.userProfile.type,
                    role: userData.userProfile.role,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }, function(error, userProfileId) {
                    if(error) {
                        throw new Meteor.Error('error', error.error);
                    } else {
                        Accounts.createUser({
                            email: userData.emailAddress,
                            password: userData.password,
                            username: userData.username,
                            profile: UserProfiles.findOne(userProfileId),
                        });

                        var user = Meteor.users.findOne({
                            'profile._id': userProfileId
                        });
    
                        Meteor.users.update({ _id: user._id }, {
                            $set: {
                                updatedAt: new Date(),
                                deletedAt: null
                            }
                        });
                    }
                });
            } else {
                throw new Meteor.Error("Email-error", "Email already exist !");
            }
        }
    },
    'users.update': function(userId, userData) {
        check(userData, {
            username: String,
            emailAddress: String,
            password: String,
            userProfile: Object
        });
        
        // Validation of Data from the Client using the Collection's Schema
        UserProfiles.schema.validate(userData.userProfile);

        var currentUser = Meteor.user();
        // Get the current user's type and role for validating insertion purpose
        var currentUserType = currentUser.profile.type;
        var currentUserRole = currentUser.profile.role.role;
        
        if(currentUserType == "admin" && currentUserRole != "Super Administrator" && userData.userProfile.type == "admin") {
            throw new Meteor.Error('create-error', 'Admin can only create user-type user');
        } else {
            var user = Meteor.users.findOne({_id: userId});
            var userProfileId = user.profile._id;
        
            return UserProfiles.update({ _id: userProfileId }, {
                $set: {
                    firstName: userData.userProfile.firstName,
                    lastName: userData.userProfile.lastName,
                    address: userData.userProfile.address,
                    contactNo: userData.userProfile.contactNo,
                    type: userData.userProfile.type,
                    role: userData.userProfile.role,
                    charts: userData.userProfile.charts,
                    updatedAt: new Date(),
                }
            }, function(error) {
                if(error) {
                    throw new Meteor.Error('error', error.error);
                } else {
                    Meteor.users.update({ _id: userId }, {
                        $set: {
                            'emails.0.address': userData.emailAddress,
                            username: userData.username,
                            profile: UserProfiles.findOne(userProfileId),
                            updatedAt: new Date()
                        }
                    });
                    Accounts.setPassword(userId, userData.password);
                }
            });
        }
    },
    'users.remove': function(userId) {
        var currentUser = Meteor.user();
        // Get the current user's type and role for validating deletion purpose
        var currentUserType = currentUser.profile.type;
        var currentUserRole = currentUser.profile.role.role;

        // Get the user to identify its type before deletion
        var user = Meteor.users.findOne({ _id: userId });

        if(currentUserType == "admin" && currentUserRole != "Super Administrator" && user.profile.type == "admin") {
            throw new Meteor.Error('delete-error', 'Admin can only delete user-type user');
        } else {
            // Soft Delete
            Meteor.users.update({ _id: userId }, {
                $set: {
                    deletedAt: new Date(),
                }
            });
        }
    },
    'users.charts': function(userId, charts) {
        check(charts, Array);
        check(userId, String);

        var user = Meteor.users.findOne({_id: userId});
        var userProfileId = user.profile._id;

        return UserProfiles.update({ _id: userProfileId }, {
            $set: {
                charts: charts,
                updatedAt: new Date(),
            }
        }, {
            multi: true
        }, function(error) {
            if(error) {
                throw new Meteor.Error('error', error.error);
            } else {
                Meteor.users.update({ _id: userId }, {
                    $set: {
                        profile: UserProfiles.findOne(userProfileId),
                        updatedAt: new Date()
                    }
                });
            }
        });
    },
});