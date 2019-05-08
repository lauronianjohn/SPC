// Definition of the Configurations Collection

import { Mongo } from 'meteor/mongo';

export const Configurations = new Mongo.Collection('configurations');

// Schema
Configurations.schema = new SimpleSchema({
	configuredBy: {
		type: Object,
	},
	'configuredBy._id': {
		type: String
	},
	'configuredBy.emailAddress': {
		type: String
	},
	'configuredBy._id': {
		type: String
	},
	'configuredBy.emailAddress': {
		type: String
	},
	product: {
		type: Object
	},
	'product._id': {
		type: String
	},
	'product.name': {
		type: String
	},
	sampleSize: {
		type: Number
	},
	actualSize: {
		type: Number,
		optional: true
	},
	tester: {
		type: Object
	},
	'tester._id': {
		type: String
	},
	'tester.name': {
		type: String
	},
	parameter: {
		type: Object
	},
	'parameter._id': {
		type: String
	},
	'parameter.name': {
		type: String
	},
	controlLimit: {
		type: Object
	},
	'controlLimit.upperControlLimit': {
		type: Number
	},
	'controlLimit.lowerControlLimit': {
		type: Number
	},
	specLimit: {
		type: Object
	},
	'specLimit.upperSpecLimit': {
		type: Number
	},
	'specLimit.lowerSpecLimit': {
		type: Number
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