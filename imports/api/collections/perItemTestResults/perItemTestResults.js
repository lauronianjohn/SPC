// Definition of the PerItemTestResults Collection

import { Mongo } from 'meteor/mongo';

export const PerItemTestResults = new Mongo.Collection('perItemTestResults');

// Schema
PerItemTestResults.schema = new SimpleSchema({
	assembly: {
		type: String
	},
	product: {
		type: Object
	},
	itemCode: {
		type: String
	},
	testResults: {
		type: Array
	},
	'testResults.$': {
		type: Object
	},
	'testResults.$.tester': {
		type: Object
	},
	'testResults.$.parameter': {
		type: Object
	},
	measurement: {
		type: Number
	},
	dataResultId: {
		type: Number
	},
	dataResultCreatedAt: {
		type: Date
	},
	createdAt: {
		type: Date,
		optional: true
	}
});