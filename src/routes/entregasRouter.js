const express = require('express');
const entregasRoutes = express.Router();

const { entregasController } = require('../controllers/entregasController');

entregasRoutes.get('/', entregasController.buscarTodasEntregas);
entregasRoutes.get('/:idEntrega', entregasController.buscarEntregaPorID);
entregasRoutes.post('/', entregasController.incluirEntrega);
entregasRoutes.put('/:idEntrega', entregasController.atualizarEntrega);
entregasRoutes.delete('/:idEntrega', entregasController.deleteEntrega);

module.exports = entregasRoutes;
