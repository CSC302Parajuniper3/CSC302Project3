const mongoose = require('mongoose');

// todo: fill in activity definition schema
const ActivityDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        minLength: 1,
        unique: true,
        required: true
    }
});

const ActivityDefinition = mongoose.model('ActivityDefinition', ActivityDefinitionSchema);

module.exports = { ActivityDefinition };
