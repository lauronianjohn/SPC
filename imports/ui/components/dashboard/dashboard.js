import './dashboard.html';

// Component(s)
import '../../components/charts/candlestick/candlestick.js';
import '../../components/charts/histogram/histogram.js';
import '../../components/charts/pareto/pareto.js';
import '../../components/charts/range/range.js';
import '../../components/charts/xbar/xbar.js';
import '../../components/charts/yield/yield.js';
import '../../components/modals/modals.js';
import '../alert-message/alert-message.js'
import { Tracker } from 'meteor/tracker';

// Mongo Collection(s)
import { Configurations } from '/imports/api/collections/configurations/configurations.js';

Template.Dashboard.onCreated(function() {
    Tracker.autorun(function() { 
        Meteor.subscribe('users.all');
        Meteor.subscribe('configurations.all', function() {
            Session.set('configuration', Configurations.find({
                deletedAt: null,
            }, { sort: {createdAt: -1} }).fetch());
        });

        var user = Meteor.users.findOne({_id: Meteor.userId()});
        
        if(user) {
            var chart = user.profile.charts;
            if(chart) {
                var userChart1 = {
                    chartName: chart[1],
                    section: 'chart1'
                };
                var userChart2 = {
                    chartName: chart[2],
                    section: 'chart2'
                };
                var userChart3 = {
                    chartName: chart[3],
                    section: 'chart3'
                };
                var userChart4 = {
                    chartName: chart[4],
                    section: 'chart4'
                };
                var userChart5 = {
                    chartName: chart[5],
                    section: 'chart5'
                };
            }
        } else {
            var userChart1 = null;
            var userChart2 = null;
            var userChart3 = null;
            var userChart4 = null;
            var userChart5 = null;
        }
        
        Session.set('graphSection', null);
        Session.set('chart1', userChart1);
        Session.set('chart2', userChart2);
        Session.set('chart3', userChart3);
        Session.set('chart4', userChart4);
        Session.set('chart5', userChart5);
    });
});

Template.Dashboard.helpers({
    chartData1() {
        var chartData = Session.get('chart1');
        return chartData;
    },
    chartData2() {
        var chartData = Session.get('chart2');
        return chartData;
    },
    chartData3() {
        var chartData = Session.get('chart3');
        return chartData;
    },
    chartData4() {
        var chartData = Session.get('chart4');
        return chartData;
    },
    chartData5() {
        var chartData = Session.get('chart5');
        return chartData;
    },
    configuration() {
        var config = Session.get('configuration');
        return config;
    },
    validateChart(name, chartData) {
        if(name === chartData.chartName) {
            return true;
        }
    },
    equal(chartData, section) {
        if(chartData) {
            if(chartData.section === section) {
                return true;
            }
        }
    }
});

Template.Dashboard.events({
    'click .choose': function(event) {
        var element = event.currentTarget;
        var dataValue = element.getAttribute('data-value');
        Session.set('graphSection', dataValue);

        var modal = document.getElementById('formModal');
        modal.style.display = 'block';
    },
    'click .image-content': function(event) {
        var img = document.getElementsByClassName('image-content');
        
        for(var i = 0; i < img.length; i++) {
            img[i].classList.remove('selected');
        }

        const target = event.target.closest('.image-content');
        target.classList.add('selected');
    },
    'click .select-graph': function(event) {
        event.preventDefault();

        var data = document.getElementsByClassName("selected");
        var alt = data[0].getElementsByClassName("sm-img")[0].getAttribute("alt");
        var img = document.getElementsByClassName('image-content');
        var modal = document.getElementById('formModal');
        modal.style.display = "none";

        for(var i = 0; i < img.length; i++) {
            img[i].classList.remove('selected');
        }
        var graphSection = Session.get('graphSection');

        dataChart = {
            chartName: alt,
            section: graphSection
        }

        if(graphSection === 'chart1') {
            Session.set('chart1', dataChart);
        } else if(graphSection === 'chart2') {
            Session.set('chart2', dataChart);
        } else if(graphSection === 'chart3') {
            Session.set('chart3', dataChart);
        } else if(graphSection === 'chart4') {
            Session.set('chart4', dataChart);
        } else if(graphSection === 'chart5') {
            Session.set('chart5', dataChart);
        }

        document.getElementById(graphSection).style.display = 'none';
    },
    'click #save-custom': function(event) {
        var modal = document.getElementById('confirmDash');
        modal.style.display = 'block';
    },
    'click #removeGraph':function(event) {
        event.preventDefault();
        var graphValue = event.currentTarget.getAttribute('data-value');

        if(graphValue === 'chart1') {
            Session.set('chart1', null);
        } else if(graphValue === 'chart2') {
            Session.set('chart2', null);
        } else if(graphValue === 'chart3') {
            Session.set('chart3', null);
        } else if(graphValue === 'chart4') {
            Session.set('chart4', null);
        } else if(graphValue === 'chart5') {
            Session.set('chart5', null);
        }
    }
});