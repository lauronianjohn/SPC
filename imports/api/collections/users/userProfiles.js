// Definition of the UserProfiles Collection

import { Mongo } from 'meteor/mongo';

export const UserProfiles = new Mongo.Collection('userProfiles');

// Schema
UserProfiles.schema = new SimpleSchema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    address: {
        type: String,
        optional: true
    },
    contactNo: {
        type: String,
        optional: true
    },
    type: {
        type: String,
        optional: true
    },
    role: {
        type: Object
    },
    'role._id': {
        type: String
    },
    'role.role': {
        type: String
    },
    'role.description': {
        type: String
    },
    'role.type': {
        type: String
    },
    charts: {
        type: Array,
        optional: true
    },
    'charts.$': {
        type: String,
        optional: true
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