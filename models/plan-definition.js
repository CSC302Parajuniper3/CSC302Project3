const mongoose = require('mongoose');

// todo: fill in plan definition schema
const PlanDefinitionSchema = new mongoose.Schema({
    id: {
        type: ObjectID,
        minLength: 1,
        required: true
    }
});

const PlanDefinition = mongoose.model('PlanDefinition', PlanDefinitionSchema);

module.exports = { PlanDefinition };
