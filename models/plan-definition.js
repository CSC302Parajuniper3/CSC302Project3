const mongoose = require('mongoose');

const PlanDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        minLength: 1,
        unique: true,
        required: true
    },
    resourceType: {
        type: String,
        minLength: 10,
        default: "PlanDefinition"
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
    type: {},
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
    goal: [],
    action: []
});

const PlanDefinition = mongoose.model('PlanDefinition', PlanDefinitionSchema);

module.exports = PlanDefinition;
