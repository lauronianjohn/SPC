import './roles.html';

// Component(s)
import '../../../alert-message/alert-message.js'
import '../../../modals/modals.js';

// Meteor Package(s)
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

// Mongo Collection(s)
import { RolePermissions } from '/imports/api/collections/rolePermissions/rolePermissions.js';


// Global Object for View Navigation
var globalObj = {};

Template.Roles_list.onCreated(function () {
	var instance = this;
	instance.state = new ReactiveDict();
	instance.limit = new ReactiveVar(10);
	instance.loaded = new ReactiveVar(0);
	instance.searching = new ReactiveVar(false);
	instance.searchKeyword = new ReactiveVar();

	// Check the user who is currently logged in
	var user = Meteor.user();
	if (user) {
		if (user.profile.role.role == "Super Administrator") {
			this.state.set({
				viewAll: true,
				viewAdmins: false,
				viewUsers: false
			});
		} else if (user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
			this.state.set({
				viewAll: false,
				viewAdmins: true,
				viewUsers: false,
				viewEditButton: false,
			});

			var viewAdmins = document.getElementById('view-admins');
			if (viewAdmins) {
				viewAdmins.parentElement.classList.add('active');
			}
		}
	}

	// Autorun
	instance.autorun(function () {
		var user = Meteor.user();
		if (user) {
			if (user.profile.role.role == "Super Administrator") {
				if (instance.state.get('viewAdmins')) {
					Session.set('rolesList', RolePermissions.find({
						'role.role': {
							$ne: "Super Administrator"
						},
						'role.type': {
							$eq: "admin"
						}
					}).fetch());
				} else if (instance.state.get('viewUsers')) {
					Session.set('rolesList', RolePermissions.find({
						'role.role': {
							$ne: "Super Administrator"
						},
						'role.type': {
							$eq: "user"
						}
					}).fetch());
				} else {
					Session.set('rolesList', RolePermissions.find({
						'role.role': {
							$ne: "Super Administrator"
						},
					}).fetch());
				}
			} else if (user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				if (instance.state.get('viewUsers')) {
					Session.set('rolesList', RolePermissions.find({
						'role.role': {
							$ne: "Super Administrator"
						},
						'role.type': {
							$eq: "user"
						}
					}).fetch());
				} else {
					Session.set('rolesList', RolePermissions.find({
						'role.role': {
							$ne: "Super Administrator"
						},
						'role.type': {
							$eq: "admin"
						}
					}).fetch());
				}
			}

			// Limit Per Query
			var limit = instance.limit.get();

			// Subscription(s)
			var querySubscription = Meteor.subscribe('rolePermissions.list', {
				limit: limit,
				sort: { createdAt: -1 }
			});
			// If querySubscription is ready, set new limit
			if (querySubscription.ready()) {
				instance.loaded.set(limit);
			}

			var searchSubscription = Meteor.subscribe('rolePermissions.search', instance.searchKeyword.get(), () => {
				setTimeout(() => {
					instance.searching.set(false);
				}, 100);
			});
			// If searchSubscription is ready, set new limit
			if (searchSubscription.ready()) {
				instance.loaded.set(limit);
			}
		}
	});

	instance.foundRoles = function () {
		var keyword = instance.searchKeyword.get();

		if (instance.state.get('viewAdmins')) {
			return RolePermissions.find({
				'role.type': {
					$eq: "admin"
				},
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
			}, { limit: instance.loaded.get(), sort: { createdAt: -1 } }).fetch();
		} else if (instance.state.get('viewUsers')) {
			return RolePermissions.find({
				'role.type': {
					$eq: "user"
				},
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
			}, { limit: instance.loaded.get(), sort: { createdAt: -1 } }).fetch();
		} else {
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
			}, { limit: instance.loaded.get(), sort: { createdAt: -1 } }).fetch();
		}
	};

	globalObj = {
		viewAll: this.state.get('viewAll'),
		viewAdmins: this.state.get('viewAdmins'),
		viewUsers: this.state.get('viewUsers'),
		viewEditButton: this.state.get('viewEditButton')
	};
});

Template.Roles_list.onRendered(function () {
});

// Template Helpers
// Roles_list
Template.Roles_list.helpers({
	// Found Roles from Search Keyword
	foundRoles() {
		return Template.instance().foundRoles();
	},
	isSuperAdmin() {
		var user = Meteor.user();
		if (user) {
			if (user.profile.role.role == "Super Administrator") {
				return true;
			} else if (user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				var viewAdmins = document.getElementById('view-admins');
				if (viewAdmins) {
					viewAdmins.parentElement.classList.add('active');
				}
			} else {
				return false;
			}
		}
	},
	// Nothing Found from Search Keyword
	nothingFound() {
		return Template.instance().foundRoles().length == 0;
	},
	roles() {
		return Session.get('rolesList');
	},
	// Searching Roles
	searching() {
		return Template.instance().searching.get();
	},
	// Keyword to Search from Roles
	searchKeyword() {
		return Template.instance().searchKeyword.get();
	},
	viewActions() {
		var instance = Template.instance();
		var user = Meteor.user();
		if (user) {
			if (user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				if (instance.state.get('viewAdmin')) {
					return !instance.state.get('viewAdmin');
				} else if (instance.state.get('viewUsers')) {
					return instance.state.get('viewUsers');
				} else {
					return false;
				}
			} else if (user.profile.type == "user") {
				return false;
			} else {
				return true;
			}
		}
	},
	viewCreateButton() {
		var user = Meteor.user();
		if(user) {
			var userRoleId = user.profile.role._id;
			var rolePermissions = RolePermissions.findOne({ 'role._id': userRoleId });
			if(rolePermissions) {
				var permissions = rolePermissions.permissions;
				var hasPermissionToCreate = false;

				if (user.profile.type == 'admin' && user.profile.role.role == 'Super Administrator') {
					hasPermissionToCreate = true;
				} else {
					permissions.forEach(element => {
						var permission = element.function;

						if (permission == 'create') {
							hasPermissionToCreate = true;
						}
					});
				}
			}
			return {
				hasPermissionToCreate,
			};
		} 
	},
});
// Roles_data
Template.Roles_data.helpers({
	viewActions() {
		var user = Meteor.user();
		if (user) {
			if (user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				if (globalObj.viewAll) {
					return !globalObj.viewAll;
				} else if (globalObj.viewUsers) {
					return globalObj.viewUsers;
				} else {
					return false;
				}
			} else if (user.profile.type == "user") {
				return false;
			} else {
				return true;
			}
		}
	},
	viewEditButton() {
		var user = Meteor.user();
		if (user.profile) {
			var userRoleId = user.profile.role._id;
			var rolePermissions = RolePermissions.findOne({ 'role._id': userRoleId });

			if(rolePermissions) {
				var permissions = rolePermissions.permissions;

				var hasPermissionToEdit = false;

				if (user.profile.type == 'admin' && user.profile.role.role == 'Super Administrator') {
					hasPermissionToEdit = true;
				} else {
					permissions.forEach(element => {
						var permission = element.function;

						if (permission == 'update') {
							hasPermissionToEdit = true;
						}
					});
				}
			}
			return hasPermissionToEdit;
		}
	},
	viewDeleteButton() {
		var user = Meteor.user();
		var userRoleId = user.profile.role._id;
		var rolePermissions = RolePermissions.findOne({ 'role._id': userRoleId });
		
		if(rolePermissions) {
			var permissions = rolePermissions.permissions;

			var hasPermissionToDelete = false;

			if (user.profile.type == 'admin' && user.profile.role.role == 'Super Administrator') {
				hasPermissionToDelete = true;
			} else {
				permissions.forEach(element => {
					var permission = element.function;

					if (permission == 'delete') {
						hasPermissionToDelete = true;
					}
				});
			}
		}

		return hasPermissionToDelete;
	},
});

// Template Events
Template.Roles_list.events({
	'click #view-all': function (event, instance) {
		event.target.parentElement.classList.add('active');

		var viewAdmins = document.getElementById('view-admins');
		var viewUsers = document.getElementById('view-users');

		viewAdmins.parentElement.classList.remove('active');
		viewUsers.parentElement.classList.remove('active');

		// Retrieves all roles except "Super Administrator" - is set on Session variable
		Session.set('rolesList', RolePermissions.find({
			'role.role': {
				$ne: "Super Administrator"
			},
		}).fetch());

		instance.state.set({
			viewAll: true,
			viewAdmins: false,
			viewUsers: false
		});

		globalObj = {
			viewAll: instance.state.get('viewAll'),
			viewAdmins: instance.state.get('viewAdmins'),
			viewUsers: instance.state.get('viewUsers')
		};
	},
	'click #view-admins': function (event, instance) {
		event.target.parentElement.classList.add('active');

		var viewAll = document.getElementById('view-all');
		var viewUsers = document.getElementById('view-users');

		if (viewAll) {
			viewAll.parentElement.classList.remove('active');
		}
		viewUsers.parentElement.classList.remove('active');

		// Retrieves all roles with type "admin" except "Super Administrator" - is set on Session variable
		Session.set('rolesList', RolePermissions.find({
			'role.role': {
				$ne: "Super Administrator"
			},
			'role.type': {
				$eq: "admin"
			}
		}).fetch());

		instance.state.set({
			viewAll: false,
			viewAdmins: true,
			viewUsers: false
		});

		globalObj = {
			viewAll: instance.state.get('viewAll'),
			viewAdmins: instance.state.get('viewAdmins'),
			viewUsers: instance.state.get('viewUsers')
		};
	},
	'click #view-users': function (event, instance) {
		event.target.parentElement.classList.add('active');

		var viewAll = document.getElementById('view-all');
		var viewAdmins = document.getElementById('view-admins');

		if (viewAll) {
			viewAll.parentElement.classList.remove('active');
		}
		viewAdmins.parentElement.classList.remove('active');

		// Retrieves all roles with type "user" except "Super Administrator" - is set on Session variable
		Session.set('rolesList', RolePermissions.find({
			'role.role': {
				$ne: "Super Administrator"
			},
			'role.type': {
				$eq: "user"
			}
		}).fetch());

		instance.state.set({
			viewAll: false,
			viewAdmins: false,
			viewUsers: true
		});;

		globalObj = {
			viewAll: instance.state.get('viewAll'),
			viewAdmins: instance.state.get('viewAdmins'),
			viewUsers: instance.state.get('viewUsers')
		};
	},
	'click .delete-role': function (event) {
		event.preventDefault();

		var modal = document.getElementById('deleteModal');
		modal.style.display = 'block';
		document.getElementById('delete-id').value = this._id;
	},
	'click .delete': function (event) {
		event.preventDefault();

		var rolePermissionId = document.getElementById('delete-id').value;
		var alertMessage = document.getElementById('alert-message');

		Meteor.call('deleteRoleWithPermissions', rolePermissionId, function(error) {
            if(error) {
                Session.set('failure', error.reason);
				alertMessage.style.display = 'block';
			} else {
				Session.set('success', 'Successfully Deleted');
				alertMessage.style.display = 'block';
			}
		});

		document.getElementById('delete-id').value = '';
		var modal = document.getElementById('deleteModal');
		modal.style.display = 'none';
	},
	'click .role-list': function (event) {
		event.preventDefault();

		var radioButton = document.getElementsByClassName('functionName');
		var tar = document.getElementsByTagName('tr');
		document.getElementById('access-all').setAttribute('disabled', true);

		for (var i = 0; i < radioButton.length; i++) {
			radioButton[i].setAttribute("readonly", true);
		}

		for (var i = 0; i < tar.length; i++) {
			tar[i].classList.remove('selected');
		}

		const target = event.target.closest('tr');
		target.classList.add('selected');

		var element = document.getElementsByClassName('selected');
		var elementVal = element[0].getAttribute('data-id');

		Session.set('roleId', elementVal);

		var modal = document.getElementById('role-view');
		modal.style.display = 'block';
	},
	'click .session': function () {
		Session.keys = {}
	},
	'keyup #search': function (event, instance) {
		var code = event.which;
		if (code == 13) {
			event.preventDefault();
		} else {
			instance.searching.set(true);

			var searchVal = instance.find("#search").value;
			instance.searchKeyword.set(searchVal);
		}
	},
});