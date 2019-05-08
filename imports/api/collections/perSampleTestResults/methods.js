// Methods related to PerSampleTestResults Collection

// Meteor Package(s)
import { Meteor } from 'meteor/meteor';

// Mongo Collection(s)
import { PerSampleTestResults } from './perSampleTestResults.js';

Meteor.methods({
    'perSampleTestResults.insert': function(perSampleTestResultData) {
        try {
            PerSampleTestResults.insert({
                configuration: perSampleTestResultData.configuration,
                sampleItems: perSampleTestResultData.items,
                xBarResult: perSampleTestResultData.xBarResult,
                rChartResult: perSampleTestResultData.rChartResult,
                minimum: perSampleTestResultData.minimum,
                firstQuartile: perSampleTestResultData.firstQuartile,
                median: perSampleTestResultData.median,
                thirdQuartile: perSampleTestResultData.thirdQuartile,
                maximum: perSampleTestResultData.maximum,
                createdAt: new Date(),
            }, function(error, perSampleTestResultId) {
                if(error) {
                    throw new Meteor.Error('error', error.error);
                } else {
                    var perSampleTestResult = PerSampleTestResults.findOne({ _id: perSampleTestResultId });
                    var sampleItems = perSampleTestResult.sampleItems;

                    var measurements = []; // Array of measurements for calculation purposes
                    sampleItems.forEach(function(sampleItem) {
                        measurements.push(sampleItem.measurement);
                    });

                    // Get the length of the measurements array
                    var measurementsLength = measurements.length;
                    
                    var bin = 5; // Default Bin of 5
                    // Minimum and Maximum of all sampleItems
                    var overallMin = measurements[0];
                    var overallMax = measurements[measurementsLength - 1];
                    
                    // Minimum and Maximum per data for binRange
                    var minimum = overallMin;
                    var maximum = 0;
                
                    var dataWithBinRange = []; // Array for all data with binRange
                    for(var i = 0; i < measurementsLength; i++) {
                        if(minimum == overallMin) {
                            maximum = minimum + (bin-1);
                        }

                        if(measurements[i] > maximum) {
                            minimum = minimum + bin;
                            maximum = (minimum-1) + bin
                        }

                        if(measurements[i] >= (overallMax - (bin-1)) || measurements[i] == overallMax) {
                            maximum = overallMax;
                            minimum = overallMax - (bin-1);
                        }
                        
                        var perDataWithBinRange = {
                            bin: bin,
                            binRange: {
                                minimum: minimum,
                                maximum: maximum,
                            },
                            sampleItem: sampleItems[i],
                            minimum: minimum, // For grouping of data purposes
                        };

                        dataWithBinRange.push(perDataWithBinRange);
                    }

                    // Group each data by its minimum measurement
                    var reducedDataPerMin = dataWithBinRange.reduce(function(accumulator, item) {  
                        var key = item.minimum;

                        accumulator[key] = accumulator[key] || [];
                        accumulator[key].push(item);
                        
                        return accumulator;
                    }, []);

                    // Simplify the grouped data by its minimum measurement and identify the binCount
                    var reducedDataPerMinWithCount = [];
                    for(var key of reducedDataPerMin.keys()) {
                        var dataArray = reducedDataPerMin[key];
                        if(dataArray) {
                            var binCount = dataArray.length;
                            dataArray.forEach(element => {
                                delete element.minimum;
                                element.binCount = binCount;
                                return element;
                            });

                            reducedDataPerMinWithCount.push(dataArray);
                        }
                    }
                    
                    // Call the method to insert the array of reducedDataPerMinWithCount into histogramData
                    Meteor.call('histogramData.insertMany', reducedDataPerMinWithCount, function(error) {
                        if(error) {
                            throw new Meteor.Error('error', error.error);
                        }
                    });
                }
            });
        } catch(error) {
            throw new Meteor.Error('error', error.error);
        }
    }
});