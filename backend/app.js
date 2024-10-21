require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('./utils/db');
const ruleRoutes = require('./routes/ruleRoutes');

const app = express();
app.use(bodyParser.json());

// Define routes
app.use('/api/rules', ruleRoutes);

module.exports = app;
