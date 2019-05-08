import './header.html'
import '../../components/modals/modals.js';

Template.Header.events({
    'click #fetch-profile': function() {
        event.preventDefault();

        var modal = document.getElementById('user-profile');
		modal.style.display = 'block';
    }
});