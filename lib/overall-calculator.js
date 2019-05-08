// Overall Calculator

// Helpers
import { calculateData } from './helpers.js';
import { histogramOverAllFormat } from './helpers.js';

// Mongo Collection(s)
import { PerItemTestResults } from '/imports/api/collections/perItemTestResults/perItemTestResults.js';

/* 
 * Function for Calculating Overall Items (Histogram)
 *
 * @param array configuration
 * @return array
 */
export const calculateHistogramOverallItems = function calculateHistogramOverallItems(configuration) {
    var overallItemTestResults = PerItemTestResults.find({ 
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
        },
    }).fetch();

    return histogramOverAllFormat(overallItemTestResults);
}

/* 
 * Function for Calculating Overall Items
 *
 * @param array configuration
 * @return array
 */
export const calculateOverallItems = function calculateOverallItems(configuration) {
    var overallItemTestResults = PerItemTestResults.find({ 
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
        },
    }).fetch();

    return calculateData(overallItemTestResults);
}