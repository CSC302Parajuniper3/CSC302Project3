const mongoose = require('mongoose');
const { ObjectID } = require('mongodb')

// todo: fill in activity definition schema
const ActivityDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        minLength: 1,
        required: true
    }
});

const ActivityDefinition = mongoose.model('ActivityDefinition', ActivityDefinitionSchema);

module.exports = { ActivityDefinition };
