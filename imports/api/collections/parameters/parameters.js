// Definition of the Parameters Collection

import { Mongo } from 'meteor/mongo';

export const Parameters = new Mongo.Collection('parameters');

// Schema
Parameters.schema = new SimpleSchema({
  	name: {
    	type: String
  	},
	createdAt: {
		type: Date,
		optional: true
	},
	updatedAt: {
		type: Date,
		optional: true
	},
	deletedAt: {
		type: Date,
		optional: true
	}
});