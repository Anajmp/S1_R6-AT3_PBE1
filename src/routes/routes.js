const express = require('express');
const router = express.Router();

const clienteRoutes = require('./clientesRouter');
router.use('/clientes', clienteRoutes);
const pedidosRoutes = require('./pedidosRouter');
router.use('/pedidos', pedidosRoutes);
const entregasRoutes = require('./entregasRouter');
router.use('/entregas', entregasRoutes);

module.exports = router;
