import './alert-message.html';

//meteor packages
import { Session } from 'meteor/session';

Template.Alert_message.onCreated(function() {
    setTimeout(function(){ 
        var message = document.getElementById('alert-message');
        if(message) {
            message.style.opacity = 0;
        }
    }, 3000);
});

Template.Alert_message.helpers({
    failure() {
        return Session.get('failure');
    },
    success() {
        return Session.get('success');
    }
});

Template.Alert_message.events({	
    'click .close': function() {	
         document.getElementById('alert-message').style.display = 'none';
         Session.keys = {}	
    },	
 }); 