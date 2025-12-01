const express = require('express');
const router = express.Router();

const clienteRoutes = require('./clientesRouter');
router.use('/', clienteRoutes);
const pedidosRoutes = require('./pedidosRouter');
router.use('/', pedidosRoutes);
const entregasRoutes = require('./entregasRouter');
router.use('/', entregasRoutes);

module.exports = router;
