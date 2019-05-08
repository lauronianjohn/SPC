import './sidebar.html';

// Component(s)
import '../../../components/modals/modals.js';


// Template Helpers
Template.Admin_sidebar.helpers({
    currentAdmin() {
        return Meteor.user();
    }
});

// Template Events
Template.Admin_sidebar.events({
    'click a': function() {
        Session.keys = {}
    },
    'click .user-info': function(event) {
        event.preventDefault();

        const target = event.target.closest('.user-info');

        var collapsedElement = document.getElementsByClassName('collapsed');
        for(var c =0; c < collapsedElement.length; c++)  {
            collapsedElement[c].classList.remove('toggle');
        }
        
        target.classList.add('toggle');
        var classToggle = document.getElementsByClassName('toggle');

        for(var i = 0; i < classToggle.length; i++) {
            var dropdown = classToggle[i].nextElementSibling;
            
            if(dropdown.style.display === 'block') {
                dropdown.style.display = 'none';
                dropdown.classList.remove('open');
            } else {
                dropdown.style.display = 'block';
                dropdown.classList.add('open');
            }
        }   
    },
    'click #change-pass': function(event) {
        event.preventDefault();

        var modal = document.getElementById('change-password');
		modal.style.display = 'block';
    },
    'click #logout-admin': function(event) {
        event.preventDefault();
        
        Meteor.logout(function(error) {
	        if(error) {
	            throw new Meteor.Error("Log out failed!");
	        } else {
	        	FlowRouter.go('/login');
	        }
    	});
    },
    'click .menu-item': function(event) {
        var elements = document.querySelector('.active');

        if(elements !== null) {
            elements.classList.remove('active');
            elements.classList.add('inactive');
        }

        event.target.parentElement.classList.add('active');
    }
});