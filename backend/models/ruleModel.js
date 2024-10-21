const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ast: { type: Object, required: true }, // Store AST structure
});

const Rule = mongoose.model('Rule', ruleSchema);

module.exports = Rule;
