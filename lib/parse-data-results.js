// Mongo Collection(s)
import { DataResults } from '/imports/api/collections/dataResults/dataResults.js';
import { Parameters } from '/imports/api/collections/parameters/parameters.js';
import { PerItemTestResults } from '/imports/api/collections/perItemTestResults/perItemTestResults.js';
import { Products } from '/imports/api/collections/products/products.js';
import { Testers } from '/imports/api/collections/testers/testers.js';

if(Meteor.isServer) {
    // Class CronJob
    var CronJob = require('cron').CronJob;
    var job = new CronJob({
        cronTime: '00 * * * * *',
        onTick: Meteor.bindEnvironment(function() {
            var perItemTestResults = [];
            var perItemTestResultsCount = PerItemTestResults.find().count();
            var perItemTestResultLatestRecord = PerItemTestResults.find({},{sort: {$natural: -1}, limit: 1}).fetch();

            var dataResults = DataResults.find({}).fetch();
            
            if(perItemTestResultsCount && perItemTestResultLatestRecord) {
                dataResults = DataResults.find({ 'data.id': { $gt: perItemTestResultLatestRecord[0].dataResultId } }).fetch();
            }
            
            // Check if an element exists in array using a comparer function
            Array.prototype.inArray = function(comparer) { 
                for(var i=0; i < this.length; i++) { 
                    if(comparer(this[i])) return true; 
                }
                return false; 
            };

            // Adds an element to the array if it does not already exist using a comparer 
            Array.prototype.pushIfNotExist = function(element, comparer) { 
                if(!this.inArray(comparer)) {
                    this.push(element);
                }
            };

            dataResults.forEach(element => {
                var productResults = DataResults.find({ 
                    'data.assembly': element.data.assembly,
                    'data.product_name': element.data.product_name,
                    'data.item_code': element.data.item_code,
                }).fetch();

                var perItemTestResult = {};
                var testResults = [];
                
                productResults.forEach(element => {
                    perItemTestResult = {
                        assembly: element.data.assembly,
                        product: Products.findOne({ name: element.data.product_name }),
                        itemCode: element.data.item_code,
                        testResults: testResults,
                        measurement: element.data.measurement,
                        dataResultId: element.data.id,
                        dataResultCreatedAt: element.data.created_at,
                        createdAt: new Date()
                    };
                    
                    testResults.push({
                        tester: Testers.findOne({ name: element.data.tester_name }),
                        parameter: Parameters.findOne({ name: element.data.parameter_name })
                    });

                    perItemTestResult.testResults = testResults;
                });

                perItemTestResults.pushIfNotExist(perItemTestResult, function(e) { 
                    return (e.assembly === element.data.assembly && e.product.name === element.data.product_name && e.itemCode === element.data.item_code); 
                });
            });
            
            perItemTestResults.forEach(element => {
                PerItemTestResults.insert(element);
            });
        }),
        start: false,
        timeZone: 'Asia/Taipei'
    });
    
    job.start();
}