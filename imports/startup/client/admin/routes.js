// Meteor Package(s)
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { FlowRouter } from 'meteor/kadira:flow-router';

// Component(s)
import '../../../ui/components/admin/dashboard/dashboard.js';
import '../../../ui/components/admin/forms/roles/roles.js';
import '../../../ui/components/admin/forms/users/users.js';
import '../../../ui/components/admin/lists/users/users.js';
import '../../../ui/components/admin/lists/roles/roles.js';

// Layout(s)
import '../../../ui/layouts/body/body.js';
import '../../../ui/layouts/headers/admin/header.js';
import '../../../ui/layouts/sidebars/admin/sidebar.js';

// Page(s)
import '../../../ui/pages/admin/home/home.js';

// Set up all routes for the admin side
var adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

// Admin's Home Page (Dashboard)
FlowRouter.route('/admin', {
    name: 'admin-home-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'Admin_dashboard'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// Handling /admin/create-role
adminRoutes.route('/create-role', {
    name: 'admin-role-create-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'Role_create'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// Handling /admin/edit-role
adminRoutes.route('/edit-role/:_id', {
    name: 'admin-role-update-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'Role_update'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// Handling /admin/roles-list
adminRoutes.route('/roles-list', {
    name: 'admin-roles-list-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'Roles_list'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// Handling /admin/create-user
adminRoutes.route('/create-user', {
    name: 'admin-user-create-page',
    action() {
        if(Meteor.userId()) {
            Session.keys = {}
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'User_create'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// Handling /admin/edit-user
adminRoutes.route('/edit-user/:_id', {
    name: 'admin-user-update-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'User_update'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});

// Handling /admin/users-list
adminRoutes.route('/users-list', {
    name: 'admin-users-list-page',
    action() {
        if(Meteor.userId()) {
            BlazeLayout.render('Admin_home', {
                header: 'Admin_header',
                sidebar: 'Admin_sidebar',
                main: 'Users_list'
            });
        } else {
            FlowRouter.go('/login');
        }
    }
});