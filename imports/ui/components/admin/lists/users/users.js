import './users.html';

// Component(s)
import '../../../modals/modals.js';
import '../../../alert-message/alert-message.js'

// Meteor Package(s)
import { Session } from 'meteor/session';
import { ReactiveDict } from 'meteor/reactive-dict';

// Mongo Collection(s)
import { RolePermissions } from '/imports/api/collections/rolePermissions/rolePermissions.js';

// Global Object for View Navigation
var globalObj = {};

Template.Users_list.onCreated(function() {

	Meteor.subscribe('rolePermissions.all');
	// Reactive Dictionary and Variables Initialization
	var instance = this;
	instance.state = new ReactiveDict();
	instance.limit = new ReactiveVar(20);
	instance.loaded = new ReactiveVar(0);
	instance.searching = new ReactiveVar(false);
	instance.searchKeyword = new ReactiveVar();

	// Check the user who is currently logged in
	var user = Meteor.user();
	if(user) {
		if(user.profile.role.role == "Super Administrator") {
			instance.state.set({
				viewAll: true,
				viewAdmins: false,
				viewUsers: false
			});
		} else if(user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
			instance.state.set({
				viewAll: false,
				viewAdmins: true,
				viewUsers: false
			});
	
			var viewAdmins = document.getElementById('view-admins');
			if(viewAdmins) {
				viewAdmins.parentElement.classList.add('active');
			}
		}
	}

	// Autorun
	instance.autorun(function() {
		var user = Meteor.user();
		if(user) {
			if(user.profile.role.role == "Super Administrator") {
				if(instance.state.get('viewAdmins')) {
					Session.set('usersList', Meteor.users.find({
						'profile.type': { 
							$eq: "admin" 
						},
						'profile.role.role': { 
							$ne: "Super Administrator" 
						},
						'profile.deletedAt': { 
							$eq: null
						},
						deletedAt: null,
					}, { sort: {createdAt: -1} }).fetch());
				} else if(instance.state.get('viewUsers')) {
					Session.set('usersList', Meteor.users.find({
						'profile.type': { 
							$eq: "user" 
						},
						'profile.role.role': { 
							$ne: "Super Administrator" 
						},
						'profile.deletedAt': { 
							$eq: null
						},
						deletedAt: null,
					}, { sort: {createdAt: -1} }).fetch());
				} else {
					Session.set('usersList', Meteor.users.find({
						'profile.role.role': { 
							$ne: "Super Administrator" 
						},
						'profile.deletedAt': { 
							$eq: null
						},
						deletedAt: null,
					}, { sort: {createdAt: -1} }).fetch());
				}
			} else if(user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				if(instance.state.get('viewUsers')) {
					Session.set('usersList', Meteor.users.find({
						'profile.type': { 
							$eq: "user" 
						},
						'profile.role.role': { 
							$ne: "Super Administrator" 
						},
						'profile.deletedAt': { 
							$eq: null
						},
						deletedAt: null,
					}, { sort: {createdAt: -1} }).fetch());
				} else {
					Session.set('usersList', Meteor.users.find({
						'profile.type': { 
							$eq: "admin" 
						},
						'profile.role.role': { 
							$ne: "Super Administrator" 
						},
						'profile.deletedAt': { 
							$eq: null
						},
						deletedAt: null,
					}, { sort: {createdAt: -1} }).fetch());
				}
			}

			// Limit Per Query
			var limit = instance.limit.get();

			// Subscription(s)
			var querySubscription = Meteor.subscribe('users.list', {
				limit: limit, 
				sort: {createdAt: -1}
			});
			// If querySubscription is ready, set new limit
			if(querySubscription.ready()) {
				instance.loaded.set(limit);
			}

			var searchSubscription = Meteor.subscribe('users.search', instance.searchKeyword.get(), () => {
				setTimeout( () => {
					instance.searching.set(false);
				}, 100);
			});
			// If searchSubscription is ready, set new limit
			if(searchSubscription.ready()) {
				instance.loaded.set(limit);
			}
		}
	});

	instance.foundUsers = function() {
		var keyword = instance.searchKeyword.get();
		
		if(instance.state.get('viewAdmins')) {
			return Meteor.users.find({
				'profile.type': { 
					$eq: "admin" 
				},
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
			}, { limit: instance.loaded.get(), sort: {createdAt: -1} }).fetch();
		} else if(instance.state.get('viewUsers')) {
			return Meteor.users.find({
				'profile.type': { 
					$eq: "user" 
				},
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
			}, { limit: instance.loaded.get(), sort: {createdAt: -1} }).fetch();
		} else {
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
			}, { limit: instance.loaded.get(), sort: {createdAt: -1} }).fetch();
		}
	};

	globalObj = {
		viewAll: instance.state.get('viewAll'),
		viewAdmins: instance.state.get('viewAdmins'),
		viewUsers: instance.state.get('viewUsers')
	};
});

Template.Users_list.onRendered(function() {
	//
});

// Template Helpers
Template.Users_list.helpers({	
	//button permission
	createButton() {
		var user = Meteor.user();
		if(user) {
			var userRoleId = user.profile.role._id;
			var roleId = RolePermissions.findOne({'role._id': userRoleId});
			if(roleId) {
				var permission = roleId.permissions;
				var hasPermissionToCreate = false;

				if(user.profile.type == 'admin' && user.profile.role.role == 'Super Administrator') {
					hasPermissionToCreate = true;
				} else {
					permission.forEach(element => {
						var permission = element.function;
			
						if(permission == 'create') {
							hasPermissionToCreate = true;
						}
					});
				}
			}
			return hasPermissionToCreate;
		}
	},
	editButton() {
		var user = Meteor.user();
		if(user) {
			var userRoleId = user.profile.role_id;
			var roleId = RolePermissions.findOne({ 'role._id': userRoleId});
			if(roleId) {
				var permissions = roleId.permissions;
				var hasPermissionToEdit = false;

				if(user.profile.type == 'admin' && user.profile.role.role == 'Super Administrator') {
					hasPermissionToEdit = true;
				} else {
					permissions.forEach(element => {
						var permission = element.function;
			
						if(permission == 'edit') {
							hasPermissionToEdit = true;
						}
					});
				}
			}
			return hasPermissionToEdit;
		}
	},
	foundUsers() {
		return Template.instance().foundUsers();
	},
	isSuperAdmin() {
		var user = Meteor.user();
		if(user) {
			if(user.profile.role.role == "Super Administrator") {
				return true;
			} else if(user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				var viewAdmins = document.getElementById('view-admins');
				if(viewAdmins) {
					viewAdmins.parentElement.classList.add('active');
				}
			} else {
				return false;
			}
		}
	},
	// Nothing Found from Search Keyword
	nothingFound() {
		return Template.instance().foundUsers().length == 0;
	},
	// Searching Users
	searching() {
		return Template.instance().searching.get();
	},
	// Keyword to Search from Users
	searchKeyword() {
		return Template.instance().searchKeyword.get();
	},
	users() {
		return Session.get('usersList');
	},
	viewActions() {
		var instance = Template.instance();
		var user = Meteor.user();
		if(user) {
			if(user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				if(instance.state.get('viewAdmin')) {
					return !instance.state.get('viewAdmin');
				} else if(instance.state.get('viewUsers')) {
					return instance.state.get('viewUsers');
				} else {
					return false;
				}
			} else if(user.profile.type == "user") { 
				return false;
			} else {
				return true;
			}
		}
	}, 
});

Template.User_data.helpers({
	viewActions() {
		var user = Meteor.user();
		if(user) {
			if(user.profile.type == "admin" && user.profile.role.role != "Super Administrator") {
				if(globalObj.viewAll) {
					return !globalObj.viewAll;
				} else if(globalObj.viewUsers) {
					return globalObj.viewUsers;
				} else {
					return false;
				}
			} else if(user.profile.type == "user") { 
				return false;
			} else {
				return true;
			}
		}
	},
});

// Template Events
Template.Users_list.events({
	'click #view-all': function(event, instance) {
		event.target.parentElement.classList.add('active');

		var viewAdmins = document.getElementById('view-admins');
		var viewUsers = document.getElementById('view-users');
		
		viewAdmins.parentElement.classList.remove('active');
		viewUsers.parentElement.classList.remove('active');

		// Retrieves all users except "Super Administrator" - is set on Session variable
		Session.set('usersList', Meteor.users.find({
			'profile.role.role': { 
				$ne: "Super Administrator" 
			},
			'profile.deletedAt': { 
				$eq: null
			},
			deletedAt: null,
		}, { sort: {createdAt: -1} }).fetch());
		
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
	'click #view-admins': function(event, instance) {
		event.target.parentElement.classList.add('active');
		
		var viewAll = document.getElementById('view-all');
		var viewUsers = document.getElementById('view-users');
		
		if(viewAll) {
			viewAll.parentElement.classList.remove('active');
		}
		viewUsers.parentElement.classList.remove('active');

		// Retrieves all users with type "admin" except "Super Administrator" - is set on Session variable
		Session.set('usersList', Meteor.users.find({
			'profile.type': { 
				$eq: "admin" 
			},
			'profile.role.role': { 
				$ne: "Super Administrator" 
			},
			'profile.deletedAt': { 
				$eq: null
			},
			deletedAt: null,
		}, { sort: {createdAt: -1} }).fetch());

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
	'click #view-users': function(event, instance) {
		event.target.parentElement.classList.add('active');

		var viewAll = document.getElementById('view-all');
		var viewAdmins = document.getElementById('view-admins');
		
		if(viewAll) {
			viewAll.parentElement.classList.remove('active');
		}
		viewAdmins.parentElement.classList.remove('active');

		// Retrieves all users with type "user" except "Super Administrator" - is set on Session variable
		Session.set('usersList', Meteor.users.find({
			'profile.type': { 
				$eq: "user" 
			},
			'profile.role.role': { 
				$ne: "Super Administrator" 
			},
			'profile.deletedAt': { 
				$eq: null
			},
			deletedAt: null,
		}, { sort: {createdAt: -1} }).fetch());

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
	'click .remove-user': function(event) {
		event.preventDefault();

		var modal = document.getElementById('deleteModal');
		modal.style.display = 'block';
		document.getElementById('delete-id').value = this._id;
	},
	'click .delete': function(event) {
		event.preventDefault();

		var userId = document.getElementById('delete-id').value;

		Meteor.call('users.remove', userId, function(error) {
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
	'click .user-list': function(event) {
		event.preventDefault();
		
        var tar = document.getElementsByTagName('tr');
        for(var i = 0; i < tar.length; i++) {
            tar[i].classList.remove('selected');
        }

        const target = event.target.closest('tr');
        target.classList.add('selected');

        var element = document.getElementsByClassName('selected');
        var elementVal = element[0].getAttribute('data-id');
		
		Session.set('userId', elementVal);
		
		var modal = document.getElementById('user-view');
		modal.style.display = 'block';
	},
	'click .session': function() {
		Session.keys = {}
	},
	'keyup #search': function(event, instance) {
		var code = event.which;
    	if(code == 13) {
			event.preventDefault();
		} else {
			instance.searching.set(true);

			var searchVal = instance.find("#search").value;
			instance.searchKeyword.set(searchVal);
		}
	},
});