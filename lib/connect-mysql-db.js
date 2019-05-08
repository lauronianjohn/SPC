// Mongo Collection(s)
import { DataResults } from '/imports/api/collections/dataResults/dataResults.js';
import { Parameters } from '/imports/api/collections/parameters/parameters.js';
import { Products } from '/imports/api/collections/products/products.js';
import { Testers } from '/imports/api/collections/testers/testers.js';

if(Meteor.isServer) {
    // Connect to MySQL Database using Knex.js
    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: '104.248.150.181',
            user: 'revelo',
            password: 'revelo12345',
            database: 'flex'
        },
        pool: { 
            min: 0, 
            max: 7 
        },
        acquireConnectionTimeout: 10000,
    });
    
    // Class CronJob
    var CronJob = require('cron').CronJob;
    var job = new CronJob({
        cronTime: '00 * * * * *',
        onTick: Meteor.bindEnvironment(function() {
            var latestRecord = DataResults.find({},{sort: {$natural: -1}, limit: 1}).fetch();
            
            async function getDataResults() {
                var query = knex.select('*').from('test_results').timeout(1000, {cancel: true});
               
                if(latestRecord.length > 0) {
                    query.where('id', '>', latestRecord[0].data.id);
                }
                
                return query;
            }
    
            (async function() {
                const result = await getDataResults(); 
                var newDate = new Date();
                
                if(result) {
                    result.forEach(element => {
                        DataResults.insert({
                            data: element,
                            createdAt: newDate
                        });
        
                        var paramName = element.parameter_name;
                        if(Parameters.find( { name: { $eq: paramName } }).count() == 0) {
                            Parameters.insert({
                                name: paramName,
                                createdAt: newDate
                            });
                        }
                        
                        var productName = element.product_name;
                        if(Products.find( { name: { $eq: productName } }).count() == 0) {
                            Products.insert({
                                name: productName,
                                createdAt: newDate
                            });
                        }
        
                        var testerName = element.tester_name;
                        if(Testers.find( { name: { $eq: testerName } }).count() == 0) {
                            Testers.insert({
                                name: testerName,
                                createdAt: newDate
                            });
                        }
                    });
                }
            }())
        }),
        start: false,
        timeZone: 'Asia/Taipei'
    });
    
    job.start();
}