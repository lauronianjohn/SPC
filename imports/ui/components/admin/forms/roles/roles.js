import './roles.html';

// Component(s)
import '../../../alert-message/alert-message.js';

// Collection(s)
import { AppModules } from '/imports/api/collections/appModules/appModules.js';
import { RolePermissions } from '/imports/api/collections/rolePermissions/rolePermissions.js';

Template.Role_create.onCreated(function () {
    this.reactive = new ReactiveDict();

    this.reactive.set({
        rolePermission: [],
    });

    // Autorun
    this.autorun(function() {
        Meteor.subscribe('appModules.all', function() {
            Session.set('appModules', AppModules.find({
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        });
    });
});

// onCreated
Template.Role_update.onCreated(function () {
    this.reactive = new ReactiveDict();

    this.reactive.set('roleId', FlowRouter.getParam('_id'));
    this.reactive.set({
        rolePermission: [],
        moduleSelected: ''
    });

    // Autorun
    this.autorun(function() {
        Meteor.subscribe('rolePermissions.all');

        var rolePermission = RolePermissions.findOne({
            _id: Template.instance().reactive.get('roleId')
        });

        if(rolePermission) {
            var roleType = rolePermission.role.type;
        }

        Meteor.subscribe('appModules.all', function() {
            Session.set('appModules', AppModules.find({
                type: {
                    $eq: roleType
                }
            }).fetch());
        });
    });
});

// onRendered
Template.Role_create.onRendered(function () {
    Session.keys = {}
    var radioElement = document.getElementsByClassName('functionName');
    
    for(var i = 0; i < radioElement.length; i++) {
        radioElement[i].checked = true;
        radioElement[i].setAttribute('disabled', true);
    }
});

Template.Role_update.onRendered(function () {
    Meteor.subscribe('rolePermissions.all');
    Meteor.subscribe('appModules.all');
    var radioElement = document.getElementsByClassName('functionName');
    
    for(var i = 0; i < radioElement.length; i++) {
        radioElement[i].checked = true;
        radioElement[i].setAttribute('disabled', true);
    }
});

// helpers
Template.Role_create.helpers({
    dashboard(module) {
        var dashboard = 'dashboard';
        return dashboard === module;
    },
    modules() {
        return Session.get('appModules');
    },

});

Template.Role_update.helpers({
    dashboard(module) {
        var dashboard = 'dashboard';
        return dashboard === module;
    },
    modules() {
        return Session.get('appModules');
    },
    roleData() {
        return RolePermissions.findOne({
            _id: Template.instance().reactive.get('roleId')
        });
    },
});

// events
Template.Role_create.events({
    'change select': function (event, template) {
        const target = event.target;

        var selectModule = target.options[target.selectedIndex].value;
        if(selectModule == 'user') {
            Session.set('appModules', AppModules.find({
                type: {
                    $eq: 'user'
                }
            }).fetch());
        } else {
            Session.set('appModules', AppModules.find({
                type: {
                    $eq: 'admin'
                }
            }).fetch());
        }
    },
    'click tr': function (event) {
        event.preventDefault();
        var radioElement = document.getElementsByClassName('functionName');
        var accessAll = document.getElementById('access-all');
        var tar = document.getElementsByTagName('tr');

        if(!accessAll.checked) {
            for(var i = 0; i < radioElement.length; i++) {
                radioElement[i].checked = false;
                radioElement[i].removeAttribute('disabled');
            }
            for(var l = 0; l < tar.length; l++) {
                tar[l].classList.remove('selected');
            }

            const target = event.target.closest('tr');
            target.classList.add('selected');

            var data = document.getElementsByClassName('selected');
            var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');

            if(moduleData == 'dashboard') {
                for(var k = 0; k < radioElement.length; k++) {
                    radioElement[k].checked = true;
                    radioElement[k].setAttribute('disabled', true);
                }
            } else if(moduleData == 'roles') {
                document.getElementById('view').checked = true;
                document.getElementById('view').setAttribute('disabled', true);
            } else if(moduleData == 'users') {
                document.getElementById('create').checked = true;
                document.getElementById('view').checked = true;
                document.getElementById('create').setAttribute('disabled', true);
                document.getElementById('view').setAttribute('disabled', true);
            } else if(moduleData == 'configurations') {
                document.getElementById('create').checked = true;
                document.getElementById('view').checked = true;
                document.getElementById('create').setAttribute('disabled', true);
                document.getElementById('view').setAttribute('disabled', true);
            }
        }
    },
    'change .functionName': function () {
        var radioElement = document.getElementsByClassName('functionName');
        var data = document.getElementsByClassName('selected');
        var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');
        var permission = [];

        for(var i = 0; i < radioElement.length; i++) {
            if(radioElement[i].checked) {
                var permissions = moduleData + '.' + radioElement[i].value;
                permission.push(permissions);
            }
        }

        var rolePermission = {
            module: moduleData,
            permissions: permission
        }
        var rolePermissions = Template.instance().reactive.get('rolePermission');

        //delete array if exist
        for(var i = 0; i < rolePermissions.length; i++) {
            if(rolePermissions[i].module === moduleData) {
                rolePermissions.splice(i, 1);
                break;
            }
        }

        rolePermissions.push(rolePermission);
        Template.instance().reactive.set('rolePermission', rolePermissions);
    },
    'click #access-all': function () {
        var accessAll = document.getElementById('access-all');
        var radioElement = document.getElementsByClassName('functionName');
        var data = document.getElementsByClassName('selected');


        if(accessAll.checked) {
            var moduleListSelected = document.getElementsByClassName('module-list');
            var permission = [];
            var moduleList = [];

            for(var r = 0; r < radioElement.length; r++) {
                radioElement[r].checked = true;
                radioElement[r].setAttribute('disabled', true);
            }

            for(var m = 0; m < moduleListSelected.length; m++) {
                moduleListSelected[m].classList.add('selected');
            }

            for(var i = 0; i < data.length; i++) {
                var moduleElement = data[i].getElementsByClassName('module');
                for(var o = 0; o < moduleElement.length; o++) {
                    var moduleValue = moduleElement[o].getAttribute('module-value');
                    moduleList.push(moduleValue);
                }
            }

            var rolePermission = [{
                permissions: permission
            }];

            for(var a = 0; a < moduleList.length; a++) {
                var moduleData = moduleList[a];
                for(var b = 0; b < radioElement.length; b++) {
                    if(radioElement[b].checked) {
                        var permissions = moduleData + '.' + radioElement[b].value;
                        permission.push(permissions);
                    }
                }
            }

            Template.instance().reactive.set('rolePermission', rolePermission);
        } else {
            var tar = document.getElementsByTagName('tr');

            for(var e = 0; e < tar.length; e++) {
                tar[e].classList.remove('selected');
            }

            var row = document.getElementsByClassName('module-list')[0];
            row.classList.add('selected');
            var data = document.getElementsByClassName('selected');
            var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');

            if(moduleData == 'dashboard') {
                for(var k = 0; k < radioElement.length; k++) {
                    radioElement[k].checked = true;
                    radioElement[k].setAttribute('disabled', true);
                }
            }

            rolePermissions = [];

            Template.instance().reactive.set('rolePermission', rolePermissions);
        }
    },
    'submit form': function (event) {
        event.preventDefault();
        const target = event.target;

        var role = target.role.value;
        var descriptions = target.description.value;
        var element = document.getElementById('module');
        var alertMessage = document.getElementById('alert-message');
        var roleType = element.options[element.selectedIndex].value;
        var permissionsData = [];
        var permissionsList = [];
        var module = [];

        var rolePermission = Template.instance().reactive.get('rolePermission');

        rolePermission.forEach(element => {
            var elementModules = element.module;
            module.push(elementModules);
        });

        //default datas
        var adminPermissionDefaultData = ['dashboard.create', 'dashboard.view', 'dashboard.edit', 'dashboard.delete', 'roles.view', 'users.create', 'users.view'];
        var usersPermissionDefaultData = ['dashboard.create', 'dashboard.view', 'dashboard.edit', 'dashboard.delete', 'configurations.create', 'configurations.view'];
        var usersConfiguration = [ 'configurations.create', 'configurations.view'];
        var dashboardDefault = ['dashboard.create', 'dashboard.view', 'dashboard.edit', 'dashboard.delete'];
        var adminUsers = ['users.create', 'users.view'];
        var adminRoles = ['roles.view'];

        if(roleType === 'admin') {
            if(rolePermission.length == 0) {
                for(var i = 0; i < adminPermissionDefaultData.length; i++) {
                    permissionsList.push(adminPermissionDefaultData[i]);
                }
            } else if(module != 0) {
                var rolePermissionModule = [];

                for(var i = 0; i < rolePermission.length; i++) {
                    rolePermissionModule.push(rolePermission[i].module);
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }

                if(rolePermissionModule.length == 1) {
                    if(rolePermissionModule.includes('users')) {
                        for(var c = 0; c < dashboardDefault.length; c++) {
                            permissionsList.push(dashboardDefault[c]);
                        }
                        for(var a = 0; a < adminRoles.length; a++) {
                            permissionsList.push(adminRoles[a]);
                        }
                    } else if(rolePermissionModule == 'roles') {
                        for(var c = 0; c < dashboardDefault.length; c++) {
                            permissionsList.push(dashboardDefault[c]);
                        }
                        for(var b = 0; b < adminUsers.length; b++) {
                            permissionsList.push(adminUsers[b]);
                        }
                    }
                } else if(rolePermissionModule.length == 2) {
                    for(var c = 0; c < dashboardDefault.length; c++) {
                        permissionsList.push(dashboardDefault[c]);
                    }
                }
            } else {
                for(var i = 0; i < rolePermission.length; i++) {
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }
            }
        } else {
            if(rolePermission.length == 0) {

                for(var i = 0; i < usersPermissionDefaultData.length; i++) {
                    permissionsList.push(usersPermissionDefaultData[i]);

                }
            } else if(module != 0) {
                var rolePermissionModule = [];
                for(var i = 0; i < rolePermission.length; i++) {
                    rolePermissionModule.push(rolePermission[i].module);
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }

                if(rolePermissionModule == 'configurations') {
                    for(var b = 0; b < dashboardDefault.length; b++) {
                        permissionsList.push(dashboardDefault[b]);
                    }
                } else {
                    for(var b = 0; b < dashboardDefault.length; b++) {
                        permissionsList.push(dashboardDefault[b]);
                    }
                    for(var a = 0; a < usersConfiguration.length; a++) {
                        permissionsList.push(usersConfiguration[a]);
                    }
                }
            } else {
                for(var i = 0; i < rolePermission.length; i++) {
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }
            }
        }

        var roleData = {
            role: role,
            description: descriptions,
            type: roleType
        }

        for(var i = 0; i < permissionsList.length; i++) {
            var modules = permissionsList[i].split('.')[0];
            var functionName = permissionsList[i].split('.')[1];
            var permissionDatas = {
                module: modules,
                function: functionName,
                permission: roleType + '-' + modules + '.' + functionName
            }

            permissionsData.push(permissionDatas);
        }

        Meteor.call('createRoleWithPermissions', roleData, permissionsData, function(error) {
            if(error) {
                Session.set('failure', error.reason);
                alertMessage.style.display = 'block';
            } else {
                Session.set('success', 'Successfully Created');
                FlowRouter.go('/admin/roles-list');
            }
        });
    }
});

Template.Role_update.events({
    'click tr': function (event) {
        event.preventDefault();
        var radioElement = document.getElementsByClassName('functionName');
        var accessAll = document.getElementById('access-all');
        var tar = document.getElementsByTagName('tr');

        if(!accessAll.checked) {

            for(var i = 0; i < radioElement.length; i++) {
                radioElement[i].checked = false;
                radioElement[i].removeAttribute('disabled');
            }

            for(var i = 0; i < tar.length; i++) {
                tar[i].classList.remove('selected');
            }

            const target = event.target.closest('tr');
            target.classList.add('selected');

            var data = document.getElementsByClassName('selected');
            var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');
            rolePermissionId = FlowRouter.getParam('_id');

            var rolePermission = RolePermissions.findOne({ _id: rolePermissionId });
            var permission = rolePermission.permissions;

            if(moduleData == 'dashboard') {
                for(var k = 0; k < radioElement.length; k++) {
                    radioElement[k].checked = true;
                    radioElement[k].setAttribute('disabled', true);
                }
            } else if(moduleData == 'roles') {
                document.getElementById('view').checked = true;
                document.getElementById('view').setAttribute('disabled', true);
            } else if(moduleData == 'users') {
                document.getElementById('create').checked = true;
                document.getElementById('view').checked = true;
                document.getElementById('create').setAttribute('disabled', true);
                document.getElementById('view').setAttribute('disabled', true);
            } else if(moduleData == 'configurations') {
                document.getElementById('create').checked = true;
                document.getElementById('view').checked = true;
                document.getElementById('create').setAttribute('disabled', true);
                document.getElementById('view').setAttribute('disabled', true);
            }

            permission.forEach(element => {
                if(element.module === moduleData) {
                    document.getElementById(element.function).checked = true;
                }
            })
        }
    },
    'change .functionName': function () {
        var radioElement = document.getElementsByClassName('functionName');
        var data = document.getElementsByClassName('selected');
        var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');
        var permission = [];

        for(var i = 0; i < radioElement.length; i++) {
            if(radioElement[i].checked) {
                var permissions = moduleData + '.' + radioElement[i].value;
                permission.push(permissions);
            }
        }

        var rolePermission = {
            module: moduleData,
            permissions: permission
        }

        var rolePermissions = Template.instance().reactive.get('rolePermission');

        for(var i = 0; i < rolePermissions.length; i++) {
            if(rolePermissions[i].module === moduleData) {
                rolePermissions.splice(i, 1);
                break;
            }
        }

        rolePermissions.push(rolePermission);
        Template.instance().reactive.set('rolePermission', rolePermissions);
    },
    'click #access-all': function () {
        var accessAll = document.getElementById('access-all');
        var radioElement = document.getElementsByClassName('functionName');
        var data = document.getElementsByClassName('selected');

        if(accessAll.checked) {
            var moduleListSelected = document.getElementsByClassName('module-list');
            var permission = [];
            var moduleList = [];

            for(var r = 0; r < radioElement.length; r++) {
                radioElement[r].checked = true;
                radioElement[r].setAttribute('disabled', true);
            }

            for(var m = 0; m < moduleListSelected.length; m++) {
                moduleListSelected[m].classList.add('selected');
            }

            for(var i = 0; i < data.length; i++) {
                var moduleElement = data[i].getElementsByClassName('module');
                for(var o = 0; o < moduleElement.length; o++) {
                    var moduleValue = moduleElement[o].getAttribute('module-value');
                    moduleList.push(moduleValue);
                }
            }

            var rolePermission = [{
                permissions: permission
            }];

            for(var a = 0; a < moduleList.length; a++) {
                var moduleData = moduleList[a];
                for(var b = 0; b < radioElement.length; b++) {
                    if(radioElement[b].checked) {
                        var permissions = moduleData + '.' + radioElement[b].value;
                        permission.push(permissions);
                    }
                }
            }

            Template.instance().reactive.set('rolePermission', rolePermission);
        } else {
            var tar = document.getElementsByTagName('tr');

            for(var e = 0; e < tar.length; e++) {
                tar[e].classList.remove('selected');
            }

            var row = document.getElementsByClassName('module-list')[0];
            row.classList.add('selected');
            var data = document.getElementsByClassName('selected');
            var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');

            if(moduleData == 'dashboard') {
                for(var k = 0; k < radioElement.length; k++) {
                    radioElement[k].checked = true;
                    radioElement[k].setAttribute('disabled', true);
                }
            }

            rolePermissions = [];

            Template.instance().reactive.set('rolePermission', rolePermissions);
        }
    },
    'submit form': function (event) {
        event.preventDefault();
        const target = event.target;

        var role = target.role.value;
        var descriptions = target.description.value;
        var element = document.getElementById('module');
        var alertMessage = document.getElementById('alert-message');
        var roleType = element.options[element.selectedIndex].value;
        var permissionsData = [];
        var rolePermission = Template.instance().reactive.get('rolePermission');
        var rolePermissionId = Template.instance().reactive.get('roleId');

        var rolePermissionCollection = RolePermissions.findOne({ _id: rolePermissionId });
        var permissions = rolePermissionCollection.permissions;

        var permissionsList = [];
        var permissionDefaultData = [];
        var adminUsers = [];
        var adminRoles = [];
        var dashboardDefault = [];
        var userReports = [];
        var userConfigurations = [];
        var userIssueTracker = [];
        var module = [];

        rolePermission.forEach(element => {
            var elementModules = element.module;
            module.push(elementModules);
        });

        // setup default data
        // get all data under of admin role type
        permissions.forEach(element => {
            var dataElement = element.permission
            var module = dataElement.split('-')[1];
            permissionDefaultData.push(module);

            if(element.module == 'dashboard') {
                var module = dataElement.split('-')[1];
                dashboardDefault.push(module);
            }
            if(element.module == 'users') {
                var module = dataElement.split('-')[1];
                adminUsers.push(module);
            }
            if(element.module == 'roles') {
                var module = dataElement.split('-')[1];
                adminRoles.push(module);
            }
        });

        // get all data under of user role type
        // dashboard with
        permissions.forEach(element => {
            var dataElement = element.permission
            if(element.module == 'reports') {
                var module = dataElement.split('-')[1];
                userReports.push(module);
            }
            if(element.module == 'configurations') {
                var module = dataElement.split('-')[1];
                userConfigurations.push(module);
            }
            if(element.module == 'issue-tracker') {
                var module = dataElement.split('-')[1];
                userIssueTracker.push(module);
            }
        });
        // end

        if(roleType === 'admin') {
            if(rolePermission.length == 0) {
                for(var i = 0; i < permissionDefaultData.length; i++) {
                    permissionsList.push(permissionDefaultData[i]);
                }
            } else if(module != 0) {
                var rolePermissionModule = [];

                for(var i = 0; i < rolePermission.length; i++) {
                    rolePermissionModule.push(rolePermission[i].module);
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }
                if(rolePermissionModule.length == 1) {
                    if(rolePermissionModule.includes('users')) {
                        for(var c = 0; c < dashboardDefault.length; c++) {
                            permissionsList.push(dashboardDefault[c]);
                        }
                        for(var a = 0; a < adminRoles.length; a++) {
                            permissionsList.push(adminRoles[a]);
                        }
                    } else if(rolePermissionModule == 'roles') {
                        for(var c = 0; c < dashboardDefault.length; c++) {
                            permissionsList.push(dashboardDefault[c]);
                        }
                        for(var b = 0; b < adminUsers.length; b++) {
                            permissionsList.push(adminUsers[b]);
                        }
                    }
                } else if(rolePermissionModule.length == 2) {
                    for(var c = 0; c < dashboardDefault.length; c++) {
                        permissionsList.push(dashboardDefault[c]);
                    }
                }
            } else {
                for(var i = 0; i < rolePermission.length; i++) {
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }
            }
        } else {
            if(rolePermission.length == 0) {
                for(var i = 0; i < permissionDefaultData.length; i++) {
                    permissionsList.push(permissionDefaultData[i]);

                }
            } else if(module != 0) {
                var rolePermissionModule = [];
                for(var i = 0; i < rolePermission.length; i++) {
                    rolePermissionModule.push(rolePermission[i].module);
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }
                if(rolePermissionModule.length == 1) {
                    if(rolePermissionModule.includes('configurations')) {
                        for(var a = 0; a < dashboardDefault.length; a++) {
                            permissionsList.push(dashboardDefault[a]);
                        }
                        for(var b = 0; b < userReports.length; b++) {
                            permissionsList.push(userReports[b]);
                        }
                        for(var c = 0; c < userIssueTracker.length; c++) {
                            permissionsList.push(userIssueTracker[c]);
                        }
                    } else if(rolePermissionModule.includes('reports')) {
                        for(var a = 0; a < dashboardDefault.length; a++) {
                            permissionsList.push(dashboardDefault[a]);
                        }
                        for(var b = 0; b < userConfigurations.length; b++) {
                            permissionsList.push(userConfigurations[b]);
                        }
                        for(var c = 0; c < userIssueTracker.length; c++) {
                            permissionsList.push(userIssueTracker[c]);
                        }
                    } else if(rolePermissionModule.includes('issue-tracker')) {
                        for(var a = 0; a < dashboardDefault.length; a++) {
                            permissionsList.push(dashboardDefault[a]);
                        }
                        for(var b = 0; b < userConfigurations.length; b++) {
                            permissionsList.push(userConfigurations[b]);
                        }
                        for(var c = 0; c < userReports.length; c++) {
                            permissionsList.push(userReports[c]);
                        }
                    }
                } else if(rolePermissionModule.length == 2) {
                    if(rolePermissionModule.includes('configurations') && rolePermissionModule.includes('reports')) {
                        for(var a = 0; a < dashboardDefault.length; a++) {
                            permissionsList.push(dashboardDefault[a]);
                        }
                        for(var b = 0; b < userIssueTracker.length; b++) {
                            permissionsList.push(userIssueTracker[b]);
                        }
                    } else if(rolePermissionModule.includes('configurations') && rolePermissionModule.includes('issue-tracker')){
                        for(var a = 0; a < dashboardDefault.length; a++) {
                            permissionsList.push(dashboardDefault[a]);
                        }
                        for(var b = 0; b < userReports.length; b++) {
                            permissionsList.push(userReports[b]);
                        }
                    } else if(rolePermissionModule.includes('reports') && rolePermissionModule.includes('issue-tracker')) {
                        for(var a = 0; a < dashboardDefault.length; a++) {
                            permissionsList.push(dashboardDefault[a]);
                        }
                        for(var b = 0; b < userConfigurations.length; b++) {
                            permissionsList.push(userConfigurations[b]);
                        }
                    }
                } else if(rolePermissionModule.length == 3) {
                    for(var a = 0; a < dashboardDefault.length; a++) {
                        permissionsList.push(dashboardDefault[a]);
                    }
                } 
            } else {
                for(var i = 0; i < rolePermission.length; i++) {
                    for(var key in rolePermission[i].permissions) {
                        permissionsList.push(rolePermission[i].permissions[key]);
                    }
                }
            }
        }

        var roleData = {
            role: role,
            description: descriptions,
            type: roleType
        };

        for(var i = 0; i < permissionsList.length; i++) {
            var modules = permissionsList[i].split('.')[0];
            var functionName = permissionsList[i].split('.')[1];
            var permissionDatas = {
                module: modules,
                function: functionName,
                permission: roleType + '-' + modules + '.' + functionName
            }

            permissionsData.push(permissionDatas);
        }

        var rolePermissionData = {
            permissionsData,
            roleData
        };

        Meteor.call('updateRoleWithPermissions', rolePermissionId, rolePermissionData, function(error) {
            if(error) {
                Session.set('failure', error.reason);
                alertMessage.style.display = 'block';
            } else {
                Session.set('success', 'Successfully Updated');
                FlowRouter.go('/admin/roles-list');
            }
        });
    }
});
