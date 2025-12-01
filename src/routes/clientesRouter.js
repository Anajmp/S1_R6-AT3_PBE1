const express = require('express');
const clientesRoutes = express.Router();

const { clientesController } = require('../controllers/clientesController');

clientesRoutes.get('/clientes', clientesController.buscarTodosClientes);
clientesRoutes.get('/clientes/:idCliente', clientesController.buscarClientePorID);
clientesRoutes.post('/clientes', clientesController.incluirCliente);
clientesRoutes.put('/clientes/:idCliente', clientesController.atualizarCliente);
clientesRoutes.delete('/clientes/:idCliente', clientesController.deleteCliente);

module.exports = clientesRoutes;
