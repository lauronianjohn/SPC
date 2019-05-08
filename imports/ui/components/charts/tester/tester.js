import './tester.html';

//collections
import { Parameters } from '/imports/api/collections/parameters/parameters.js';
import { Testers } from '/imports/api/collections/testers/testers.js';



//oncreated
Template.TesterChart.onCreated(function() {
    const sortAlphaNum = (a, b) => a.localeCompare(b, 'en', { numeric: true });

    this.autorun(function() {
        Meteor.subscribe('parameters.all', function() {
            var parametersData = Parameters.find({}).fetch();
            var paramName = []
            for(var i = 0; i < parametersData.length; i++) {
                paramName.push(parametersData[i].name);
            }
            var paramNameSort =  paramName.sort(sortAlphaNum);
            Session.set('parameters', paramNameSort);
        });

        Meteor.subscribe('testers.all', function() {
            Session.set('testers', Testers.find({}, {sort: {
                name: 1
            }}).fetch());
        });
    });
});

//onrendered
Template.TesterChart.onRendered(function() {
    
});

//helpers
Template.TesterChart.helpers({
    parameters() {
        var param = Session.get('parameters');
        var paramValue = [];
        for(var i = 0; i < param.length; i++) {
            var data = {
                name: param[i]
            }
            paramValue.push(data);
        }
        return paramValue;
        
    },
    testers() {
        return Session.get('testers');
    },
    testerResult() {
        var testresult = Session.get('testresult');
    
        if(testresult && testresult.length) {
            for(var i = 0; i < testresult.length; i ++) {
                var parameter = testresult[i].parameter;
                var tester = testresult[i].tester;
                var paremeterElement = document.getElementById(parameter.split(' ').join(''));
                var testerElement = paremeterElement.querySelector('#'+tester.split(' ').join(''));
                testerElement.classList.remove('cell-result-empty');

                if(testresult[i].status === 'danger') {
                    testerElement.classList.add('cell-result-danger');
                } else if (testresult[i].status === 'warning') {
                    testerElement.classList.add('cell-result-warning');
                } else if (testresult[i].status === 'good') {
                    testerElement.classList.add('cell-result-good');
                }
            }
        } else {
            var spanELement = document.getElementsByTagName('span');
            for(var i = 0; i < spanELement.length; i++) {
                spanELement[i].removeAttribute("class");
                spanELement[i].classList.add('cell-result-empty');
            }
        }
    },
    trim(data) {
        return data.split(' ').join('');
    }
});

//events
Template.TesterChart.events({
    
});