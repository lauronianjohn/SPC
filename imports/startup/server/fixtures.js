// Fill the Db with sample data on startup

// Constants
import { charts } from '/lib/constants.js';
import { moduleFunctions } from '/lib/constants.js';

// Mongo Collection(s)
import { AppModules } from '/imports/api/collections/appModules/appModules.js';
import { Permissions } from '/imports/api/collections/permissions/permissions.js';
import { RolePermissions } from '/imports/api/collections/rolePermissions/rolePermissions.js';
import { Roles } from '/imports/api/collections/roles/roles.js';
import { UserProfiles } from '/imports/api/collections/users/userProfiles.js';

Meteor.startup(function() {
    // Seed Data to AppModules Collection
    if(AppModules.find().count() == 0) {
        const modules = [
            {
                name: "Dashboard",
                module: "dashboard",
                type: "admin"
            },
            {
                name: "Roles",
                module: "roles",
                type: "admin"
            },
            {
                name: "Users",
                module: "users",
                type: "admin"
            },
            {
                name: "Dashboard",
                module: "dashboard",
                type: "user"
            },
            {
                name: "Configurations",
                module: "configurations",
                type: "user"
            },
            {
                name: "Reports",
                module: "reports",
                type: "user"
            },
            {
                name: "Issue Tracker",
                module: "issue-tracker",
                type: "user"
            },
        ];

        modules.forEach(element => {
            AppModules.insert(element);
        });
    }

    // Create Super Admin with Role and Permissions
    if(Meteor.users.find().count() == 0) {
        Roles.insert({
            role: "Super Administrator",
            description: "Super Administrator have access to all the admin-type application modules.",
            type: "admin"
        }, function(error, roleId) {
            if(error) {
                throw new Meteor.Error('error', error.error);
            } else {
                var modules = AppModules.find({ type: "admin" }); // Get all AppModules by "admin" type only...
                var permissions = []; // Array for the Created Permissions

                modules.forEach(element => {
                    for(var moduleFunction in moduleFunctions)
                    {
                        var permissionId = Permissions.insert({
                            module: element.module,
                            function: moduleFunctions[moduleFunction],
                            permission: element.type + '-' + element.module + '.' + moduleFunctions[moduleFunction]
                        });

                        permissions.push(Permissions.findOne(permissionId));
                    }
                });

                var role = Roles.findOne(roleId);
                RolePermissions.insert({
                    role,
                    permissions
                }, function(error) {
                    if(error) {
                        throw new Meteor.Error('error', error.error);
                    } else {
                        var adminCharts = [];
                        for(var key in charts) {
                            adminCharts.push(charts[key]);
                        }

                        UserProfiles.insert({
                            firstName: "Super",
                            lastName: "Administrator",
                            address: "Salinas Drive, Cebu City, Cebu, Philippines 6000",
                            contactNo: "09179244462",
                            type: "admin",
                            role,
                            charts: adminCharts,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                            deletedAt: null
                        }, function(error, userProfileId) {
                            if(error) {
                                throw new Meteor.Error('error', error.error);
                            } else {
                                Accounts.createUser({
                                    email: "super-admin@email.com",
                                    password: "secret-passw0rt",
                                    username: "super-admin",
                                    profile: UserProfiles.findOne(userProfileId)
                                });

                                var superAdmin = Meteor.users.findOne({
                                    'profile._id': userProfileId
                                });

                                Meteor.users.update({ _id: superAdmin._id }, {
                                    $set: {
                                        updatedAt: new Date(),
                                        deletedAt: null
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});