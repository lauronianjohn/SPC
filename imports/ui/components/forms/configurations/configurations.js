import './configurations.html';
import '../../modals/modals.js';
import '../../alert-message/alert-message.js';

// Meteor Package(s)
import { Session } from 'meteor/session';

//Collection(s)
import { PerItemTestResults } from '/imports/api/collections/perItemTestResults/perItemTestResults.js';

Template.Configuration_create.onCreated(function() {
    this.autorun(function() { 
        Meteor.subscribe('perItemTestResults.all');
    });
});

// Events
Template.Configuration_create.events({
    //tester
    'click .choose-tester': function(event) {
        event.preventDefault();
        var modal = document.getElementById('testerModal');
        modal.style.display = 'block';
    },
    'click .select-tester': function(event) {
        event.preventDefault();
        var data = document.getElementsByClassName('selected');
        var dataselected = data[0].getElementsByClassName('tester')[0].innerText;
        var dataid = data[0].getElementsByClassName('tester')[0].getAttribute('data-id');

        document.getElementById('tester').value = dataselected;
        document.getElementById('tester_id').value = dataid;

        var modal = document.getElementById('testerModal');
        modal.style.display = 'none';
    },

    //parameter
    'click .choose-parameter': function(event) {
        event.preventDefault();
        var modal = document.getElementById('parameterModal');
        modal.style.display = 'block';
    },
    'click .select-params': function(event) {
        event.preventDefault();
        var data = document.getElementsByClassName('selected');
        var dataselected = data[0].getElementsByClassName('parameter')[0].innerText;
        var dataid = data[0].getElementsByClassName('parameter')[0].getAttribute('data-id');

        document.getElementById('parameter').value = dataselected;
        document.getElementById('parameter_id').value = dataid;

        var modal = document.getElementById('parameterModal');
        modal.style.display = 'none';
    },

    //product
    'click .choose-product': function(event) {
        event.preventDefault();
        var modal = document.getElementById('productModal');
        modal.style.display = 'block';
    },
    'click .select-product': function(event) {
        event.preventDefault();
        var data = document.getElementsByClassName('selected');
        var dataselected = data[0].getElementsByClassName('product')[0].innerText;
        var dataid = data[0].getElementsByClassName('product')[0].getAttribute('data-id');

        document.getElementById('product').value = dataselected;
        document.getElementById('product_id').value = dataid;

        var modal = document.getElementById('productModal');
        modal.style.display = 'none';
    },
    'click tr': function(event) {
        event.preventDefault();
        var tr = document.getElementsByTagName('tr');

        for(var i = 0; i < tr.length; i++) {
            tr[i].classList.remove('selected');
         }

        const target = event.target.closest('tr');
        target.classList.add('selected');
    },
    'submit form': function(event) {
        event.preventDefault();
        const target = event.target;

        var productId = target.productId.value;
        var testerId = target.testerId.value;
        var parameter_id = target.parameterId.value
        var product = target.product.value;
        var sampleSize = target.sampleSize.value;
        var tester = target.tester.value;
        var parameter = target.parameter.value;
        var upperControlLimit = target.upperControlLimit.value;
        var lowerControlLimit = target.lowerControlLimit.value;
        var upperSpecLimit = target.upperSpecLimit.value;
        var lowerSpecLimit = target.lowerSpecLimit.value;

        var actualSize = PerItemTestResults.find({ 
            'product.name': product,
            'testResults.tester.name': tester,
            'testResults.parameter.name': parameter,
        }).count();

        var currentUser = Meteor.user();

        var configData = {
            configuredBy: {
                _id: currentUser._id,
                emailAddress: currentUser.emails[0].address
            },
            product: {
                _id: productId,
                name: product,
            },
            sampleSize: parseInt(sampleSize),
            tester: {
                _id: testerId,
                name: tester,
            },
            parameter: {
                _id: parameter_id,
                name: parameter,
            },
            controlLimit: {
                upperControlLimit: parseInt(upperControlLimit),
                lowerControlLimit: parseInt(lowerControlLimit),
            },
            specLimit: {
                upperSpecLimit: parseInt(upperSpecLimit),
                lowerSpecLimit: parseInt(lowerSpecLimit),
            },
        }
        Session.set('configData', configData);

        if(sampleSize > actualSize) {
            var modal = document.getElementById('configurationError');
            modal.style.display = 'block';
        } else {
            Session.get('configData');
            Meteor.call('configurations.insert', configData, function(error) {
                if(error) {
                    Session.set('failure', error.reason);
                } else {
                    FlowRouter.go('/configurations-list');
                    Session.set('success', 'Successfully Created');
                }
            });
        }          
    }
});