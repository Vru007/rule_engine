const Rule = require('../models/ruleModel');
// const ruleService = require('../services/ruleService');
const ruleService=require('../services/ruleServices');

// Create a new rule
exports.createRule = async (req, res) => {
    try {
        const { name, ruleString } = req.body;
        console.log("Received request to create rule:");
        console.log("name:", name);
        console.log("ruleString:", ruleString);

        if (!name || !ruleString) {
            return res.status(400).json({ error: 'Name and ruleString are required' });
        }

        const ast = ruleService.createRule(name, ruleString);
        console.log("Generated AST:", JSON.stringify(ast, null, 2));

        const rule = new Rule({ name, ast });
        await rule.save();

        console.log("Rule saved successfully");
        res.status(201).json({ message: 'Rule created successfully', rule });
    } catch (err) {
        console.error("Error in createRule:", err);
        res.status(500).json({ error: 'Failed to create rule', details: err.message });
    }
};

// Evaluate a rule
exports.evaluateRule = async (req, res) => {
    try {
        const { name, data } = req.body;
        const rule = await Rule.findOne({ name });
        if (!rule) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        const result = ruleService.evaluateRule(rule.ast, data);
        res.status(200).json({ result });
    } catch (err) {
        res.status(500).json({ error: 'Failed to evaluate rule' });
    }
};
exports.combineRules = async (req, res) => {
    try {
        const { ruleNames } = req.body;
        console.log("Received request to combine rules:");
        console.log("ruleNames:", ruleNames);

        if (!ruleNames || !Array.isArray(ruleNames) || ruleNames.length === 0) {
            return res.status(400).json({ error: 'ruleNames must be a non-empty array' });
        }

        const rules = await Rule.find({ name: { $in: ruleNames } });
        if (rules.length !== ruleNames.length) {
            return res.status(404).json({ error: 'One or more rules not found' });
        }

        const asts = rules.map(rule => rule.ast);
        const combinedAst = ruleService.combineRules(asts);
        console.log("Combined AST:", JSON.stringify(combinedAst, null, 2));

        res.status(200).json({ combinedAst });
    } catch (err) {
        console.error("Error in combineRules:", err);
        res.status(500).json({ error: 'Failed to combine rules', details: err.message });
    }
};