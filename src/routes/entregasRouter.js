const express = require('express');
const entregasRoutes = express.Router();

const { entregasController } = require('../controllers/entregasController');

entregasRoutes.get('/entregas', entregasController.buscarTodasEntregas);
entregasRoutes.get('/entregas/:idEntrega', entregasController.buscarEntregaPorID);
entregasRoutes.post('/entregas', entregasController.incluirEntrega);
entregasRoutes.put('/entregas/:idEntrega', entregasController.atualizarEntrega);
entregasRoutes.delete('/entregas/:idEntrega', entregasController.deleteEntrega);

module.exports = entregasRoutes;
