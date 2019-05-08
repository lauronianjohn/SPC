// Definition of the Roles Collection

import { Mongo } from 'meteor/mongo';

export const Roles = new Mongo.Collection('roles');

// Schema
Roles.schema = new SimpleSchema({
	role: {
		type: String,
		optional: false
	},
	description: {
		type: String,
		optional: false
	},
	type: {
        type: String
	}
});