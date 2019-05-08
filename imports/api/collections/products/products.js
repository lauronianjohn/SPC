// Definition of the Products Collection

import { Mongo } from 'meteor/mongo';

export const Products = new Mongo.Collection('products');

Products.schema = new SimpleSchema({
	name: {
		type: String
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