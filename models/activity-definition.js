const mongoose = require('mongoose');

const ActivityDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        minLength: 1,
        required: true
    },
    resourceType: {
        type: String,
        minLength: 10,
        default: "ActivityDefinition"
    },
    meta: {},
    extension: [],
    url: String,
    version: { 
        type: String, 
        default: "1.0.0"
    },
    name: String,
    title: String,
    status: String,
    experimental: Boolean,
    date: Date,
    updated: {
        type: Date,
        default: Date.now()
    },
    publisher: String,
    description: String,
    jurisdiction: [],
    kind: String,
    profile: String,
    code: {},
    intent: String,
    doNotPerform: Boolean,
    dynamicValue: [],
    deleted: {
        type: Date,
        default: null
    }
});

ActivityDefinitionSchema.pre('findOne', function() {
    this.where('deleted', null);
});

ActivityDefinitionSchema.index({id: 1, deleted: 1}, {unique: true});

const ActivityDefinition = mongoose.model('ActivityDefinition', ActivityDefinitionSchema);

module.exports = ActivityDefinition;
