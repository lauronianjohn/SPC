// Methods related to Configurations Collection

// Helpers
import { calculateData } from '/lib/helpers.js';

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { Configurations } from './configurations.js';
import { PerItemTestResults } from '/imports/api/collections/perItemTestResults/perItemTestResults.js';

Meteor.methods({
    'configurations.insert': function(configData) {
        // Validation of Data from the Client using the Collection's Schema
        Configurations.schema.validate(configData);

        // Validation for Sample Size
        var sampleSize = configData.sampleSize;
        var actualSize = PerItemTestResults.find({ 
            'product.name': configData.product.name,
            'testResults': { 
                $elemMatch: {
                    'tester.name': configData.tester.name,
                    'parameter.name': configData.parameter.name
                },
            }
        }).count();

        // Validation for Unique Configuration
        var configuration = Configurations.find({
            'product.name': configData.product.name,
            'tester.name': configData.tester.name,
            'parameter.name': configData.parameter.name,
            'controlLimit.upperControlLimit': configData.controlLimit.upperControlLimit,
            'controlLimit.lowerControlLimit': configData.controlLimit.lowerControlLimit,
            'specLimit.upperSpecLimit': configData.controlLimit.upperSpecLimit,
            'specLimit.lowerSpecLimit': configData.controlLimit.lowerSpecLimit,
        }, {
            fields: {
                'product.name': 1,
                'tester.name': 1,
                'parameter.name': 1,
                'controlLimit.upperControlLimit': 1,
                'controlLimit.lowerControlLimit': 1,
                'specLimit.upperSpecLimit': 1,
                'specLimit.lowerSpecLimit': 1
            }
        }).fetch();

        if(configuration.length > 0) {
            throw new Meteor.Error('Unique-config', 'Error! Configuration already exist.');
        } else {
            Configurations.insert({
                configuredBy: configData.configuredBy,
                product: configData.product,
                sampleSize: sampleSize,
                actualSize: actualSize,
                tester: configData.tester,
                parameter: configData.parameter,
                controlLimit: configData.controlLimit,
                specLimit: configData.specLimit,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            }, function(error, configId) {
                if(error) {
                    throw new Meteor.Error('error', error.error);
                } else {
                    var configuration = Configurations.findOne({ _id: configId });

                    // Call the configurations calculation methods
                    Meteor.call('configurations.calculatePerSample', configuration);
                }
            });
        }
    },
    'configurations.remove': function(configId) {
        try {
            // Soft Delete for Configuration Collection
            Configurations.update({ _id: configId }, {
                $set: {
                    deletedAt: new Date(),
                }
            });
        } catch(error) {
            throw new Meteor.Error('error', error.error);
        }
    },
    'configurations.calculatePerSample': function(configuration) {
        var sampleSize = configuration.sampleSize;
        var perSampleTestResults = PerItemTestResults.find({ 
            'product.name': configuration.product.name,
            'testResults': { 
                $elemMatch: {
                    'tester.name': configuration.tester.name,
                    'parameter.name': configuration.parameter.name
                },
            }
        }, {
            sort: {
                measurement: 1
            }, limit: sampleSize, 
        }).fetch();

        var perSampleTestResultData = calculateData(perSampleTestResults);
        perSampleTestResultData.configuration = configuration;

        // Call the method to insert the perSampleTestResultData
        Meteor.call('perSampleTestResults.insert', perSampleTestResultData, function(error) {
            if(error) {
                throw new Meteor.Error('error', error.error);
            }
        });
    }
});