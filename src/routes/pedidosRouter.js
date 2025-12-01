const express = require('express');
const router = express.Router();
const { pedidosController } = require('../controllers/pedidosController');

router.post('/pedidos', pedidosController.criarPedido);
router.get('/pedidos', pedidosController.listarPedidos);
router.get('/pedidos/:id', pedidosController.buscarPedidoPorId);

module.exports = router;
