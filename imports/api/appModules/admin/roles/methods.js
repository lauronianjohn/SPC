// Methods related to Roles and Permissions

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Mongo Collection(s)
import { Permissions } from '/imports/api/collections/permissions/permissions.js';
import { RolePermissions } from '/imports/api/collections/rolePermissions/rolePermissions.js';
import { Roles } from '/imports/api/collections/roles/roles.js';

Meteor.methods({
	'createRoleWithPermissions': function(roleData, permissionsData) {
		// Validation of Data from the Client using the Collection's Schema
		Roles.schema.validate(roleData);
		// Permissions.schema.validate(permissionsData);
		// Checking of the Permissions Data Array
		check(permissionsData, [{
            module: String,
            function: String,
            permission: String,
        }]);
        
		try {
			var roles = Roles.findOne({ role: roleData.role });

			if(roles == null) {
				Roles.insert({
					role: roleData.role,
					description: roleData.description,
					type: roleData.type
				}, function(error, roleId) {
					if(error) {
						throw new Meteor.Error('error', error.reason);
					} else {
						var permissions = []; // Array for the Created Permissions

						permissionsData.forEach(element => {
							var permissionData = element.permission;
							var permission = Permissions.findOne({ permission: permissionData });

							if(permission == null) {
								Permissions.insert({
									module: element.module,
									function: element.function,
									permission: permissionData
								});
                            }
                            
							permissions.push(Permissions.findOne({ permission: permissionData }));
                        });
                        
						RolePermissions.insert({
							role: Roles.findOne({ _id: roleId }),
							permissions
						});
					}
				});
			} else {
				throw new Meteor.Error('Role-name', 'Role already exist!');
			}
		} catch(error) {
			throw new Meteor.Error('error', error.reason);
		}
	},
	'updateRoleWithPermissions': function(rolePermissionId, rolePermissionData) {
		// Validation of Data from the Client using the Collection's Schema
		Roles.schema.validate(rolePermissionData.roleData);
		
		try {
			var rolePermission = RolePermissions.findOne({ _id: rolePermissionId });
			// Check the Permissions of Super Admin
			var user = Meteor.users.findOne({ 'profile.role.role': 'Super Administrator' });
			var usersRoleId = user.profile.role._id;
			var rolePermissionRoleId = RolePermissions.findOne({ 'role._id': usersRoleId });
			var permissionData = rolePermissionRoleId.permissions;
			var roleId = rolePermission.role._id;
			var permissions = rolePermission.permissions;

			Roles.update({ _id: roleId }, {
				$set: {
					role: rolePermissionData.roleData.role,
					description: rolePermissionData.roleData.description,
					type: rolePermissionData.roleData.type,
				}
			});
			
			// Delete all the permissions to be replaced by the new ones
			if(permissions == permissionData) {
				throw new Meteor.Error('error', error.reason);
			} else {
				permissions.forEach(element => {
					Permissions.remove({_id: element._id});
				});
			}

			var permissions = []; // Array for the Created Permissions

			rolePermissionData.permissionsData.forEach(element => {
				var permissionData = element.permission;

				var permission = Permissions.findOne({permission: permissionData});

				if(permission == null) {
					Permissions.insert({
						module: element.module,
						function: element.function,
						permission: element.permission
					});
				}
				permissions.push(Permissions.findOne({permission: permissionData}));
			});

			RolePermissions.update({ _id: rolePermissionId }, {
				$set: {
					role: Roles.findOne({ _id: roleId}),
					permissions: permissions,
				}
			});
		} catch(error) {
			throw new Meteor.Error('error', error.reason);
		}
	},
	'deleteRoleWithPermissions': function(rolePermissionId) {
		try {
			var rolePermission = RolePermissions.findOne({ _id: rolePermissionId});
			var roleId = rolePermission.role._id;
			// Check if the role has been used by at least one user
			var user = Meteor.users.findOne({'profile.role._id': roleId});
			var permissions = rolePermission.permissions;

			if(user && user.deletedAt == null) {
				throw new Meteor.Error('remove-error', 'Cannot remove this role since currently used by users!');
			} else {
				RolePermissions.remove({
					_id: rolePermissionId
				}, function(error) {
					if(error) {
						throw new Meteor.Error('error', error.reason);
					} else {
						Roles.remove({ _id: roleId });
						permissions.forEach(element => {
							Permissions.remove(element);
						});
					}
				});
			}
		} catch(error) {
			throw new Meteor.Error('error', error.reason);
		}
	},
});