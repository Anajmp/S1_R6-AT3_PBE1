const express = require('express');
const clientesRoutes = express.Router();

const { clientesController } = require('../controllers/clientesController');

clientesRoutes.get('/', clientesController.buscarTodosClientes);
clientesRoutes.get('/:idCliente', clientesController.buscarClientePorID);
clientesRoutes.post('/', clientesController.incluirCliente);
clientesRoutes.put('/:idCliente', clientesController.atualizarCliente);
clientesRoutes.delete('/:idCliente', clientesController.deleteCliente);

module.exports = clientesRoutes;
