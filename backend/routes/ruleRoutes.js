const express = require('express');
const router = express.Router();
const ruleController=require('../controllers/ruleController')
// const ruleController = require('../controllers/ruleController');


router.post('/create', ruleController.createRule);
router.post('/evaluate', ruleController.evaluateRule);
router.post('/combine', ruleController.combineRules);
module.exports = router;
