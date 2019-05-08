import './modals.html';

// Mongo Collection(s)
import { AppModules } from '/imports/api/collections/appModules/appModules.js';
import { Configurations } from '/imports/api/collections/configurations/configurations.js';
import { Parameters } from '/imports/api/collections/parameters/parameters.js';
import { PerItemTestResults } from '/imports/api/collections/perItemTestResults/perItemTestResults.js';
import { Products } from '/imports/api/collections/products/products.js';
import { RolePermissions } from '/imports/api/collections/rolePermissions/rolePermissions.js';
import { Testers } from '/imports/api/collections/testers/testers.js';

// Template Created
//Configuration
Template.Configurations.onCreated(function() {
    this.autorun(function() { 
        Meteor.subscribe('configurations.all');
    });
});

// Parameter
Template.Parameters.onCreated(function() {
    const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true });

    this.autorun(function() { 
        Meteor.subscribe('parameters.all', function() {
            var parametersData = Parameters.find({}).fetch();
            var paramName = [];

            for(var i = 0; i < parametersData.length; i++) {
                paramName.push(parametersData[i].name);
            }

            var paramNameSort =  paramName.sort(sortAlphaNum);
            Session.set('parameters', paramNameSort);
        });
    });
});

// PerItem
Template.PerItem.onCreated(function() {
    this.autorun(function() { 
        Meteor.subscribe('configurations.all');
        Meteor.subscribe('perItemTestResults.all', function() {
            Session.set('perItem', PerItemTestResults.find({}).fetch());
        });
    });
});

// Product
Template.Products.onCreated(function() {
    this.autorun(function() { 
        Meteor.subscribe('products.all');
    });
});
// Role_view
Template.Role_view.onCreated(function () {
    this.autorun(function() { 
        Meteor.subscribe('appModules.all');
        Meteor.subscribe('rolePermissions.all');
    });
});
// Tester
Template.Testers.onCreated(function() {
    this.autorun(function() { 
        Meteor.subscribe('testers.all');
    });
});

//template onrendered
Template.Role_view.onRendered(function() {
	var radioElement = document.getElementsByClassName('functionName');
     for(var i = 0; i < radioElement.length;i++) {
        radioElement[i].checked = true;
    }
});

Template.Configurations.onRendered(function() {

})

// Template Helpers
//Configuration
Template.Configurations.helpers({
    configuration() {
        var reportsDataId = Session.get('dataId');
        if(reportsDataId) {
            return Configurations.find({
                _id : reportsDataId
            }).fetch();
        } else {
            return Configurations.find({}).fetch();
        }
    },
    overAll() {
        var categoryValue = Session.get('dataCategory');
        if(categoryValue === 'overall') {
            return true;
        } else {
            return false;
        }
    }
});

// Parameter
Template.Parameters.helpers({
    parameters() {
        var param = Session.get('parameters');
        var paramValue = [];
        if(param) {
            for(var i = 0; i < param.length; i++) {
                var paramResult = Parameters.findOne({name: param[i]});
                var data = {
                    name: param[i],
                    _id: paramResult._id
                }
                paramValue.push(data);
            }
            return paramValue;
        }
    }
});

Template.PerItem.helpers({
    products() {
        return PerItemTestResults.find({});
    },
    itemDetails() {
        return Session.get('itemDetails');
    }
});

// Product
Template.Products.helpers({
    products() {
        return Products.find({});
    }
});
// Role_view
Template.Role_view.helpers({
    appModules() {
        var roleId = Session.get('roleId');
        var rolePermision = RolePermissions.findOne({
            _id: roleId
        });

        if(rolePermision) {
            return AppModules.find({
                type: rolePermision.role.type
            });
        }
    },
    dashboard(module) {
        var dashboard = 'dashboard';
        return dashboard === module;
    },
    rolePermission() {
        var roleId = Session.get('roleId');

        return RolePermissions.findOne({
            _id: roleId
        });
    },
});
// User_profile
Template.User_profile.helpers({
    userProfileData() {
        return Meteor.user();
    }
});
// User_view
Template.User_view.helpers({
    userData() {
        return Meteor.users.findOne({
            _id: Session.get('userId'),
        });
    }
});
// Tester
Template.Testers.helpers({
    testers() {
		return Testers.find({});
	},
});

// Template Events
// Custom Dashboard
Template.Change_password.events({
    'click .no': function() {
        var modal = document.getElementById('change-password');
		modal.style.display = 'none';
    },
    'click .submit': function(event) {
        event.preventDefault();

        var oldPass = document.getElementById('oldPassword').value;
        var newPass = document.getElementById('newPassword').value;
        var changePass = document.getElementById('changePassword').value;

        if(newPass === changePass) {
            Accounts.changePassword(oldPass, newPass, function(error) {
                if(error) {
                    Session.set('failure', error.reason);
                    alertMessage.style.display = 'block';
                } else {
                    Session.set('success', 'Successfully Updated');
                }
            });
        } else {
            Session.set('failure', 'New Password and Confirm Password dont match !');
        }
        var modal = document.getElementById('change-password');
        modal.style.display = 'none';
    },
});

Template.Configurations.events({
    'click .cancel': function() {
        var modal = document.getElementById('configurationModal');
        var tr = document.getElementsByTagName('tr');

        for(var i = 0; i < tr.length; i++) {
            tr[i].classList.remove('selected');
         }

        modal.style.display = 'none';
    }
});

// Configuration Error
Template.Configuration_Error.events({
    'click .close-toggle': function() {
        var modal = document.getElementById('configurationError');
        modal.style.display = 'none';
    },
    'click .cancel': function() {
        var modal = document.getElementById('configurationError');
        modal.style.display = 'none';
    },
    'click .yes': function(event) {
        event.preventDefault();
        var configData = Session.get('configData');
        
        Meteor.call('configurations.insert', configData, function(error) {
            if(error) {
                Session.set('failure', error.reason);
            } else {
                FlowRouter.go('/configurations-list');
                Session.set('success', 'Successfully Created');
            }
        });
        var modal = document.getElementById('configurationError');
        modal.style.display = 'none';
    }
});
//custom dashboard
Template.Custom_dashboard.events({
    'click .cancel': function() {
        var modal = document.getElementById('formModal');
        var tr = document.getElementsByTagName('tr');

        for(var i = 0; i < tr.length; i++) {
            tr[i].classList.remove('selected');
         }

        modal.style.display = 'none';
    },
    'click tr': function(event) {
        var tar = document.getElementsByTagName('tr');

        for(var i = 0; i < tar.length; i++) {
            tar[i].classList.remove('selected');
        }
         
        const target = event.target.closest('tr');
        target.classList.add('selected');
    },
});

//custom dashboard
Template.CustomDash_Confirmation.events({
    'click .no': function() {
        var modal = document.getElementById('confirmDash');
        modal.style.display = 'none';
    },
    'click .save': function(event) {
        var modal = document.getElementById('confirmDash');
        var charts = [];

        var chart5Value = document.getElementById('chart5').value;
        var chart4Value = document.getElementById('chart4').value;
        var chart3Value = document.getElementById('chart3').value;
        var chart2Value = document.getElementById('chart2').value;
        var chart1Value = document.getElementById('chart1').value;
        var chart0Value = document.getElementById('chart0').value;

        if(chart0Value) {
            charts.push(chart0Value);
        }
        if(chart1Value) {
            charts.push(chart1Value);
        }
        if(chart2Value) {
            charts.push(chart2Value);
        }
        if(chart3Value) {
            charts.push(chart3Value);
        }
        if(chart4Value) {
            charts.push(chart4Value);
        }
        if(chart5Value) {
            charts.push(chart5Value);
        }
        var userId = Meteor.userId();

        Meteor.call('users.charts', userId, charts, function(error) {
            if(error) {
                Session.set('failure', error.reason);
            } else {
                FlowRouter.go('/');
                Session.set('success', 'Successfully Saved');
            }
        });
        modal.style.display = 'none';
    },
});
// Delete_modal
Template.Delete_modal.events({
    'click .close-toggle': function() {
        var modal = document.getElementById('deleteModal');
        modal.style.display = 'none';
    },
    'click .cancel': function() {
        var modal = document.getElementById('deleteModal');
        modal.style.display = 'none';
    }
});

// Parameter
Template.Parameters.events({
    'click .cancel': function() {
        var modal = document.getElementById('parameterModal');
        var tr = document.getElementsByTagName('tr');

        for(var i = 0; i < tr.length; i++) {
            tr[i].classList.remove('selected');
         }

        modal.style.display = 'none';
    }
});

//perItem events
Template.PerItem.events({
    'click .product': function(event) {
        event.preventDefault();
        var itemId = event.currentTarget.getAttribute('data-id');
        var itemDetails = PerItemTestResults.findOne({_id: itemId});
        var measurement = itemDetails.measurement;
        var itemTestResults = itemDetails.testResults
        var perItemdata = [];
        var testResultData = [];

        for(var i = 0; i < itemTestResults.length; i++) {
            var configuration = Configurations.findOne({
                'product.name': itemDetails.product.name,
                'tester.name' : itemTestResults[i].tester.name,
                'parameter.name' : itemTestResults[i].parameter.name
            }, { sort: { _id: -1 }, limit: 1 });

            //for view only
            if(configuration === null || configuration === undefined) {
                upperSpecLimit = null;
                lowerSpecLimit = null;
                upperControlLimit = null;
                lowerControlLimit = null;
            } else {
                upperSpecLimit = configuration.specLimit.upperSpecLimit;
                lowerSpecLimit = configuration.specLimit.lowerSpecLimit;
                upperControlLimit = configuration.controlLimit.upperControlLimit;
                lowerControlLimit = configuration.controlLimit.lowerControlLimit;
            }
            
            var data = {
                tester: itemTestResults[i].tester.name,
                parameter: itemTestResults[i].parameter.name,
                specUp : upperSpecLimit,
                specLow : lowerSpecLimit,
                controlUp : upperControlLimit,
                controlLow : lowerControlLimit
            }
            perItemdata.push(data);

            //integration
            if(configuration) {
                if(measurement >= upperSpecLimit || measurement <= lowerSpecLimit) {
                    var testerParameter = {
                        tester: itemTestResults[i].tester.name,
                        parameter: itemTestResults[i].parameter.name,
                        status: 'danger'
                    }

                    testResultData.push(testerParameter);
                } else if (measurement >= upperControlLimit || measurement <= lowerControlLimit) {
                    var testerParameter = {
                        tester: itemTestResults[i].tester.name,
                        parameter: itemTestResults[i].parameter.name,
                        status: 'warning'
                    }

                    testResultData.push(testerParameter);
                } else {
                    var testerParameter = {
                        tester: itemTestResults[i].tester.name,
                        parameter: itemTestResults[i].parameter.name,
                        status: 'good'

                    }
                    testResultData.push(testerParameter);                }
            }
        }

        Session.set('itemDetails', perItemdata);
        Session.set('testresult', testResultData);
    },
    'click .cancel': function() {
        var modal = document.getElementById('PerItemModal');

        modal.style.display = 'none';
    }
});

// Product
Template.Products.events({
    'click .cancel': function() {
        var modal = document.getElementById('productModal');
        var tr = document.getElementsByTagName('tr');

        for(var i = 0; i < tr.length; i++) {
            tr[i].classList.remove('selected');
         }

        modal.style.display = 'none';
    }
});
// Role_view
Template.Role_view.events({
    'click .close-toggle': function() {
        var modal = document.getElementById('role-view');
        modal.style.display = 'none';
    },
    'click tr': function (event) {
        event.preventDefault();
        var radioElement = document.getElementsByClassName('functionName');
        var accessAll = document.getElementById('access-all');
        var tar = document.getElementsByTagName('tr');

        if(!accessAll.checked) {
            for(var i = 0; i < radioElement.length; i++) {
                radioElement[i].checked = false;
            }
            for(var i = 0; i < tar.length; i++) {
                tar[i].classList.remove('selected');
            }
    
            const target = event.target.closest('tr');
            target.classList.add('selected');
        }

        var data = document.getElementsByClassName('selected');
        var moduleData = data[0].getElementsByClassName('module')[0].getAttribute('module-value');
        rolePermissionId = Session.get('roleId');

        var rolePermission = RolePermissions.findOne({ _id: rolePermissionId });
        
        var permission = rolePermission.permissions;
        permission.forEach(element => {
            if(element.module === moduleData) {
                document.getElementById(element.function).checked = true;     
            }
        })
    },
    'click .functionName': function() {
        return false;
    }
});

// User_profile
Template.User_profile.events({
    'click .close-toggle': function() {
        var modal = document.getElementById('user-profile');
        modal.style.display = 'none';
    },
});
// User_view
Template.User_view.events({
    'click .close-toggle': function() {
        var modal = document.getElementById('user-view');
        modal.style.display = 'none';
    },
});
// Tester
Template.Testers.events({
    'click .cancel': function() {
        var modal = document.getElementById('testerModal');
        var tr = document.getElementsByTagName('tr');

        for(var i = 0; i < tr.length; i++) {
            tr[i].classList.remove('selected');
         }

        modal.style.display = 'none';
    }
});