const express = require('express');
const router = express.Router();

const {clienteRoutes} = require('./clientesRouter');

router.use('/', clienteRoutes);

module.exports = {router};