// Definition of the Testers Collection

import { Mongo } from 'meteor/mongo';

export const Testers = new Mongo.Collection('testers');

// Schema
Testers.schema = new SimpleSchema({
	name: {
		type: String,
		optional: true
	},
	createdAt: {
		type: Date
	},
	updatedAt: {
		type: Date
	},
	deletedAt: {
		type: Date
	}
});