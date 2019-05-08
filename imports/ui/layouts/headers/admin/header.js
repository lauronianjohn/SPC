import './header.html';
import '../../../components/modals/modals.js';

Template.Admin_header.events({
    'click #fetch-profile': function() {
        event.preventDefault();

        var modal = document.getElementById('user-profile');
		modal.style.display = 'block';
    }
});

