const { pedidosModel } = require('../models/pedidosModel');
const { clientesModel } = require('../models/clientesModel');
const { entregasModel } = require('../models/entregasModel');

const pedidosController = {

    /**
     * Cria um novo pedido para um cliente, realiza todo o cálculo de valores
     * (distância, peso, acréscimos, descontos e taxas), define o status e
     * grava automaticamente uma entrega vinculada ao pedido.
     *
     * ROTA: POST /pedidos
     * @async
     * @function criarPedido
     * @param {Request} req Objeto de requisição HTTP contendo o corpo do pedido
     * @param {Response} res Objeto de resposta HTTP
     * @returns {Promise<object>} Dados do pedido criado e detalhes do cálculo
     */
    criarPedido: async (req, res) => {
        try {
            const { id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_base_km, valor_base_kg} = req.body;

            // valida cliente
            const clienteExiste = await clientesModel.selecionarPorId(id_cliente_fk);
            if (clienteExiste.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado.' });
            }

            // valida tipo de entrega
            if (!['normal', 'urgente'].includes(tipo_entrega)) {
                return res.status(400).json({ message: 'Tipo de entrega inválido.' });
            }

            // cálculos
            const valor_distancia = distancia_km * valor_base_km;
            const valor_peso = peso_kg * valor_base_kg;
            const valor_base = valor_distancia + valor_peso;

            // acréscimo
            let acrescimo = 0;
            if (tipo_entrega === 'urgente') {
                acrescimo = valor_base * 0.2;
            }

            let valor_final = valor_base + acrescimo;

            // desconto
            let desconto = 0;
            if (valor_final > 500) {
                desconto = valor_final * 0.1;
                valor_final -= desconto;
            }

            // taxa extra por peso
            let taxa_extra = 0;
            if (peso_kg > 50) {
                taxa_extra = 15;
                valor_final += taxa_extra;
            }


            // cria pedido
            const pedidoCriado = await pedidosModel.inserirPedido(id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_base_km, valor_base_kg );
            const idPedido = pedidoCriado.insertId;

            await entregasModel.inserirEntrega( 
                idPedido, 
                valor_distancia, 
                valor_peso, 
                acrescimo, 
                desconto, 
                taxa_extra, 
                valor_final,
                'Pendente' 
            );

            res.status(201).json({ message: 'Pedido criado e cálculo registrado com sucesso!', id_pedido: idPedido, calculo: {valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final } });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    },

    /**
     * Lista todos os pedidos cadastrados no banco de dados.
     *
     * ROTA: GET /pedidos
     * @async
     * @function listarPedidos
     * @param {Request} req Objeto de requisição HTTP
     * @param {Response} res Objeto de resposta HTTP
     * @returns {Promise<Array<object>>} Lista de pedidos cadastrados
     */
    listarPedidos: async (req, res) => {
        try {
            const resultado = await pedidosModel.selecionarTodos();
            res.status(200).json({ data: resultado });
        } catch (error) {
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    },

    /**
     * Busca um pedido específico pelo seu ID.
     *
     * ROTA: GET /pedidos/:id
     * @async
     * @function buscarPedidoPorId
     * @param {Request} req Objeto de requisição contendo o parâmetro id
     * @param {Response} res Objeto de resposta HTTP
     * @returns {Promise<object>} Dados do pedido encontrado
     */
    buscarPedidoPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const pedido = await pedidosModel.selecionarPorId(id);

            if (pedido.length === 0) {
                return res.status(404).json({ message: 'Pedido não encontrado.' });
            }

            res.status(200).json({ data: pedido });

        } catch (error) {
            res.status(500).json({ message: 'Erro interno', error: error.message });
        }
    }

};

module.exports = {pedidosController};
