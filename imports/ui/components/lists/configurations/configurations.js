import './configurations.html';
import '../../modals/modals.js';

// Mongo Collection(s)
import { Configurations } from '/imports/api/collections/configurations/configurations.js';

Template.Configurations_list.onCreated(function() {
	Meteor.subscribe('configurations.all');
});

Template.Configurations_list.helpers({
	configurations() {
		if(Meteor.user()) {
			return Configurations.find({
				'configuredBy._id': Meteor.userId(),
				deletedAt: null
			}).fetch();
		}
	}
});

Template.Configurations_list.events({
    'click .remove-data': function(event) {
		event.preventDefault();

		var modal = document.getElementById('deleteModal');
		modal.style.display = 'block';
		document.getElementById('delete-id').value = this._id;
	},
	'click .delete': function(event) {
		event.preventDefault();
		
		var alertMessage = document.getElementById('alert-message');
		var _id = document.getElementById('delete-id').value;
		document.getElementById('delete-id').value = '';
		var configData = _id;

		Meteor.call('configurations.remove', configData, function(error) {
			if(error) {
                Session.set('failure', error.reason);
				alertMessage.style.display = 'block';
			} else {
				Session.set('success', 'Successfully Deleted');
				alertMessage.style.display = 'block';
			}
		});
		
		var modal = document.getElementById('deleteModal');
		modal.style.display = 'none';
	}
});