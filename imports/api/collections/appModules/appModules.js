// Definition of the AppModules Collection

import { Mongo } from 'meteor/mongo';

export const AppModules = new Mongo.Collection('appModules');

// Schema
AppModules.schema = new SimpleSchema({
    name: {
      	type: String
    },
    module: {
        type: String
    },
    type: {
        type: String
    }
});