// Meteor Package(s)
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Component(s)
import '../../ui/components/dashboard/dashboard.js';
import '../../ui/components/forms/configurations/configurations.js';
import '../../ui/components/lists/configurations/configurations.js';
import '../../ui/components/kanban/kanban.js';

// Layout(s)
import '../../ui/layouts/body/body.js';
import '../../ui/layouts/headers/header.js';
import '../../ui/layouts/sidebars/sidebar.js';

// Page(s)
import '../../ui/pages/auth/login/login.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/not-found/not-found.js';
import '../../ui/pages/reports/reports.js';

// Set up all routes in the app
// Not Found
FlowRouter.notFound = {
    action() {
        BlazeLayout.render('App_body', {
            main: 'App_notFound_page'
        });
    }
};

// Login
FlowRouter.route('/login', {
    name: 'login-page',
    action() {
        if(!Meteor.userId()) {
            BlazeLayout.render('App_body', {
                main: 'Auth_login_page',
            });
        } else {
            var currentUser = Meteor.user();
            if(currentUser) {
                var currentUserType = currentUser.profile.type;
                var currentUserDeletedAt = currentUser.deletedAt;
                if(currentUserType == "user" && (currentUserDeletedAt == null || currentUserDeletedAt == '')) {
                    FlowRouter.go('/');
                } else if(currentUserType == "admin" && (currentUserDeletedAt == null || currentUserDeletedAt == '')) {
                    FlowRouter.go('/admin');
                } 
            }
        }
    }
});

// User's Home Page (Dashboard)
FlowRouter.route('/', {
    name: 'home-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Home', {
                header: 'Header',
                sidebar: 'Sidebar',
                main: 'Dashboard'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

FlowRouter.route('/configurations-list', {
    name: 'configurations-list-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Home', {
                header: 'Header',
                sidebar: 'Sidebar',
                main: 'Configurations_list'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

FlowRouter.route('/create-configuration', {
    name: 'create-configuration-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Home', {
                header: 'Header',
                sidebar: 'Sidebar',
                main: 'Configuration_create'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

FlowRouter.route('/reports', {
    name: 'reports-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Home', {
                header: 'Header',
                sidebar: 'Sidebar',
                main: 'Reports'
            });
        } else {
            FlowRouter.go('/login');
        }
    },
    subscriptions: function() {
        // Fast Render
        this.register('config', Meteor.subscribe('configurations.all'));
    }
});

FlowRouter.route('/issue-tracker', {
    name: 'issue-tracker-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Home', {
                header: 'Header',
                sidebar: 'Sidebar',
                main: 'Kanban'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});