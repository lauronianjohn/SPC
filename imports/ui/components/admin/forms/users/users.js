import './users.html';

//components
import '../../../alert-message/alert-message.js';

// Meteor Package(s)
import { ReactiveDict } from 'meteor/reactive-dict';
import { Session } from 'meteor/session';

// Mongo Collection(s)
import { Roles } from '/imports/api/collections/roles/roles.js';

// Template Created
Template.User_create.onCreated(function() {
    Session.keys = {}
    this.reactive = new ReactiveDict();
    this.reactive.set({
        showtable: false
    });

    // Autorun
    this.autorun(function() {
        Meteor.subscribe('roles.all', function() {
            Session.set('roles', Roles.find({
                role: {
                    $ne: 'Super Administrator'
                },
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        });
    });
});

Template.User_update.onCreated(function () {
    this.state = new ReactiveDict();
    this.state.set('userId', FlowRouter.getParam('_id'));

    // Autorun
    this.autorun(function() {
        Meteor.subscribe('users.all');
        Meteor.subscribe('roles.all', function() {
            Session.set('roles', Roles.find({
                role: {
                    $ne: 'Super Administrator'
                },
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        });
    });
});

// Template Rendered
Template.User_create.onRendered(function() {
    Session.keys = {}
     // Autorun
     this.autorun(function() {
        Meteor.subscribe('roles.all', function() {
            Session.set('roles', Roles.find({
                role: {
                    $ne: 'Super Administrator'
                },
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        });
    });
});

Template.User_update.onRendered(function() {
     // Autorun
     this.autorun(function() {
        Meteor.subscribe('users.all');
        Meteor.subscribe('roles.all', function() {
            Session.set('roles', Roles.find({
                role: {
                    $ne: 'Super Administrator'
                },
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        });
    });
});

// Template Helper(s)
Template.User_create.helpers({
    roles() {
        return Session.get('roles');
    },
});

Template.User_update.helpers({
    roles() {
        return Roles.find({
            role: {
                $ne: 'Super Administrator'
            },
        });
    },
    userData() {
        return Meteor.users.findOne({
            _id: Template.instance().state.get('userId'),
        });
    },
    userEmailAddress() {
        var user = Meteor.users.findOne({
            _id: Template.instance().state.get('userId'),
        });

        return user.emails[0].address;
    },
});

Template.User_create.events({
    'change #user-type': function(event) {
        const target = event.target;

        var userType = target.options[target.selectedIndex].value;
        if(userType == 'admin') {
            Session.set('roles', Roles.find({
                role: {
                    $ne: 'Super Administrator'
                },
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        } else {
            Session.set('roles', Roles.find({
                role: {
                    $ne: 'Super Administrator'
                },
                type: {
                    $eq: 'user'
                }
            }).fetch());
        }
    },
    'click .choose': function(event, template) {
        event.preventDefault();
        template.reactive.set('showtable', true);
    },
    'click tr': function(event, template){
        document.getElementById('role').value = '';
        var tar = document.getElementsByTagName('tr');

        for(var i = 0; i < tar.length; i++) {
            tar[i].classList.remove('selected');
        }

        const target = event.target.closest('tr');
        target.classList.add('selected');

        var data = document.getElementsByClassName('selected');
        var data_value = data[0].getElementsByClassName('role')[0].innerText;
        document.getElementById('role').value = data_value;

        template.reactive.set('showtable', false);
    },
    'submit form': function(event) {
        event.preventDefault();
        const target = event.target;

        var firstName = target.firstName.value;
        var lastName = target.lastName.value;
        var address = target.address.value;
        var contactNo = target.contactNo.value;
        var emailAddress = target.emailAddress.value;
        var password = target.password.value;
        var confirmPassword = target.confirmPassword.value;

        var userType = target.userType;
        var userType = userType.options[userType.selectedIndex].value;

        var role = target.role.value;

        var emailAddressFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        var alertMessage = document.getElementById('alert-message');

        if(!emailAddress.match(emailAddressFormat)) {
            Session.set('failure', 'Invalid email address format.');
            alertMessage.style.display = 'block';
        } else if(password.trim().length < 8) {
            Session.set('failure', 'Password must be at least 8 characters.');
            alertMessage.style.display = 'block';
        } else if(password !== confirmPassword) {
            Session.set('failure', 'Password dont match.');
            alertMessage.style.display = 'block';
        } else {
            var username = emailAddress.split('@');
            username = username[0];

            // Find specific role to get the whole document
            role = Roles.findOne({ role: role });

            var userProfile = {
                firstName: firstName,
                lastName: lastName,
                address: address,
                contactNo: contactNo,
                type: userType,
                role,
            };
            
            var userData = {
                emailAddress: emailAddress,
                username: username,
                password: password,
                userProfile
            };

            Meteor.call('users.insert', userData, function(error) {
                if(error) {
                    Session.set('failure', error.reason);
                    alertMessage.style.display = 'block';
                } else {
                    Session.set('success', 'Successfully Created');
                    FlowRouter.go('/admin/users-list');
                }
            });
        }
    },
});

Template.User_update.events({
    'click .choose': function(event, template) {
        event.preventDefault();
        template.reactive.set('showtable', true);
    },
    'click tr': function(event, template){
        document.getElementById('updateRole').value = '';
        var tar = document.getElementsByTagName('tr');

        for(var i = 0; i < tar.length; i++) {
            tar[i].classList.remove('selected');
        }

        const target = event.target.closest('tr');
        target.classList.add('selected');

        var data = document.getElementsByClassName('selected');
        var data_value = data[0].getElementsByClassName('role')[0].innerText;
        document.getElementById('updateRole').value = data_value;

        template.reactive.set('showtable', false);
    },
    'submit form': function(event) {
        event.preventDefault();
        const target = event.target;

        var firstName = target.firstName.value;
        var lastName = target.lastName.value;
        var contactNo = target.contactNo.value;
        var address = target.address.value;
        var contactNo = target.contactNo.value;
        var emailAddress = target.emailAddress.value;
        var password = target.password.value;
        var confirmPassword = target.confirmPassword.value;

        var type = target.type.value;
        var role = target.role.value;

        var emailAddressFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        var alertMessage = document.getElementById('alert-message');

        if(!emailAddress.match(emailAddressFormat)) {
            Session.set('failure', 'Invalid email address format.');
            alertMessage.style.display = 'block';
        } else if(password && password.trim().length < 8) {
            Session.set('failure', 'Password must be at least 8 characters.');
            alertMessage.style.display = 'block';
        } else if(password !== confirmPassword) {
            Session.set('failure', 'Password dont match.');
            alertMessage.style.display = 'block';
        } else {
            var username = emailAddress.split('@');
            username = username[0];

            // Find specific role to get the whole document
            role = Roles.findOne({ role: role });

            var userProfile = {
                firstName: firstName,
                lastName: lastName,
                address: address,
                contactNo: contactNo,
                type: type,
                role,
            };
            
            var userData = {
                emailAddress: emailAddress,
                username: username,
                password: password,
                userProfile
            };
            var userId = FlowRouter.getParam('_id');
            Meteor.call('users.update', userId, userData, function(error) {
                if(error) {
                    Session.set('failure', error.reason);
                    alertMessage.style.display = 'block';
                } else {
                    Session.set('success', 'Successfully Created');
                    FlowRouter.go('/admin/users-list');
                }
            });
            
        }
    }
});