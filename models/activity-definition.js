const mongoose = require('mongoose');

const ActivityDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        minLength: 1,
        unique: true,
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
    dynamicValue: []
});

const ActivityDefinition = mongoose.model('ActivityDefinition', ActivityDefinitionSchema);

module.exports = ActivityDefinition;
