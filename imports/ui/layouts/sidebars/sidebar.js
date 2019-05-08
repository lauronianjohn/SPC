import './sidebar.html';

// Template Helpers
Template.Sidebar.helpers({
    currentUser() {
        return Meteor.user();
    }
});

// Template Events
Template.Sidebar.events({
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
            } else {
                dropdown.style.display = 'block';
            }
        }   
    },
    'click #change-pass': function(event) {
        event.preventDefault();

        var modal = document.getElementById('change-password');
		modal.style.display = 'block';
    },
    'click #logout-user': function(event) {
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