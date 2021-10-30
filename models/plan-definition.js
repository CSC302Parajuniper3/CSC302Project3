const mongoose = require('mongoose');

// todo: fill in plan definition schema
const PlanDefinitionSchema = new mongoose.Schema({
    id: {
        type: String,
        minLength: 1,
        unique: true,
        required: true
    }
});

const PlanDefinition = mongoose.model('PlanDefinition', PlanDefinitionSchema);

module.exports = PlanDefinition;
