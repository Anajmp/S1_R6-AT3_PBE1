const { entregasModel } = require('../models/entregasModel');

const entregasController = {

    /**
     * Retorna todas as entregas cadastradas no banco.
     * ROTA: GET /entregas
     * @async
     * @function buscarTodasEntregas
     * @param {Request} req Objeto de requisição HTTP
     * @param {Response} res Objeto de resposta HTTP
     * @returns {Promise<Array<object>>} Lista de entregas cadastradas
     */
    buscarTodasEntregas: async (req, res) => {
        try {
            const resultado = await entregasModel.selecionarTodas();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Nenhuma entrega cadastrada.' });
            }
            res.status(200).json({ message: 'Entregas cadastradas', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno', errorMessage: error.message});
        }
    },

    /**
     * Retorna uma entrega específica pelo seu ID.
     * ROTA: GET /entregas/:idEntrega
     * @async
     * @function buscarEntregaPorID
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object>} Objeto contendo os dados da entrega pesquisada
     */
    buscarEntregaPorID: async (req, res) => {
        try {
            const id = Number(req.params.idEntrega);

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }
            const resultado = await entregasModel.selecionarPorId(id);

            if (resultado.length === 0) {
                return res.status(404).json({ message: 'Entrega não encontrada.' });
            }

            res.status(200).json({ message: 'Entrega encontrada', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno', errorMessage: error.message});
        }
    },

    /**
     * Realiza o cadastro de uma nova entrega no banco de dados.
     * ROTA: POST /entregas
     * @async
     * @function incluirEntrega
     * @param {Request} req Objeto de requisição HTTP
     * @param {Response} res Objeto de resposta HTTP
     * @returns {Promise<object>} Resultado do registro inserido
     */
    incluirEntrega: async (req, res) => {
        try {

            const {valor_distancia,valor_peso,acrescimo,desconto,taxa_extra,valor_final,status_entrega,id_pedido_fk} = req.body;

            if (valor_distancia == null || valor_distancia < 0 || valor_peso == null || valor_peso < 0 || valor_final == null || valor_final < 0 || !id_pedido_fk || !status_entrega) {

                return res.status(400).json({message: 'Dados inválidos para criação da entrega.'});
            }

            const resultado = await entregasModel.inserirEntrega( 
                id_pedido_fk,
                valor_distancia, 
                valor_peso, 
                acrescimo ?? 0, 
                desconto ?? 0, 
                taxa_extra ?? 0, 
                valor_final, 
                status_entrega 
            );

            if (resultado.affectedRows === 1) {
                return res.status(201).json({ message: 'Entrega registrada com sucesso.', result: resultado });
            }

            throw new Error('Erro ao inserir entrega.');

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno no servidor.', errorMessage: error.message });
        }
    },

    /**
     * Atualiza os dados de uma entrega existente.
     * ROTA: PUT /entregas/:idEntrega
     * @async
     * @function atualizarEntrega
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object>} Dados da entrega atualizada
     */
    atualizarEntrega: async (req, res) => {
        try {
            const id = Number(req.params.idEntrega);
            const {valor_distancia,valor_peso,acrescimo,desconto,taxa_extra,valor_final,status_entrega,id_pedido_fk} = req.body;

            // ... (validação de ID e busca da entrega atual mantidas)
            
            const entregaAtual = await entregasModel.selecionarPorId(id);
            if (entregaAtual.length === 0) {
                return res.status(404).json({ message: 'Entrega não encontrada.' });
            }

            const e = entregaAtual[0];

            const resultado = await entregasModel.atualizarEntrega(
                id, 
                valor_distancia ?? e.valor_distancia,
                valor_peso ?? e.valor_peso,
                acrescimo ?? e.acrescimo,
                desconto ?? e.desconto,
                taxa_extra ?? e.taxa_extra,
                valor_final ?? e.valor_final,
                status_entrega ?? e.status_entrega,
                id_pedido_fk ?? e.id_pedido_fk
            );

            if (resultado.changedRows === 0) {
                throw new Error('Nenhuma alteração realizada.');
            }

            res.status(200).json({ message: 'Entrega atualizada!', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno', errorMessage: error.message });
        }
    },

    /**
     * Remove uma entrega específica pelo ID.
     * ROTA: DELETE /entregas/:idEntrega
     * @async
     * @function deleteEntrega
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object>} Informações sobre a exclusão
     */
    deleteEntrega: async (req, res) => {
        try {
            const id = Number(req.params.idEntrega);

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const existe = await entregasModel.selecionarPorId(id);

            if (!existe.length) {
                return res.status(404).json({message: 'Entrega não encontrada.'});
            }

            const resultado = await entregasModel.deleteEntrega(id);

            if (resultado.affectedRows === 1) {
                return res.status(200).json({ message: 'Entrega excluída com sucesso.', data: resultado });
            }

            throw new Error('Erro ao excluir entrega.');

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno',errorMessage: error.message});
        }
    }
};

module.exports = { entregasController };
