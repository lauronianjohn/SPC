// Definition of the Permissions Collection

import { Mongo } from 'meteor/mongo';

export const Permissions = new Mongo.Collection('permissions');

// Schema
Permissions.schema = new SimpleSchema({
	permissions: {
		type: Array,
		optional: false
	},
	'permissions.$': {
		type: Object,
		optional: false
	},
	'permissions.$.module': {
		type: String
	},
	'permissions.$.function': {
		type: String
	},
	'permissions.$.permission': {
		type: String
	}
});