const { entregasModel } = require('../models/entregasModel');

const entregasController = {

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

    incluirEntrega: async (req, res) => {
        try {

            const {valor_distancia,valor_peso,acrescimo,desconto,taxa_extra,valor_final,status_entrega,id_pedido_fk} = req.body;

        // validações básicas
        if (valor_distancia == null || valor_distancia < 0 ||valor_peso == null || valor_peso < 0 ||valor_final == null || valor_final < 0 ||!id_pedido_fk ||!status_entrega) {
            return res.status(400).json({message: 'Dados inválidos para criação da entrega.'});
        }

        // chama o model
        const resultado = await entregasModel.inserirEntrega(valor_distancia,valor_peso,acrescimo ?? 0,desconto ?? 0,taxa_extra ?? 0,valor_final,status_entrega,id_pedido_fk);

        if (resultado.affectedRows === 1) {
            return res.status(201).json({message: 'Entrega registrada com sucesso.',result: resultado});
        }

        throw new Error('Erro ao inserir entrega.');

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro interno no servidor.',errorMessage: error.message});
    }
},

    atualizarEntrega: async (req, res) => {
        try {
            const id = Number(req.params.idEntrega);
            const {valor_distancia,valor_peso,acrescimo,desconto,taxa_extra,valor_final,status_entrega,id_pedido_fk} = req.body;

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const entregaAtual = await entregasModel.selecionarPorId(id);
            if (entregaAtual.length === 0) {
                return res.status(404).json({ message: 'Entrega não encontrada.' });
            }
            const e = entregaAtual[0];
            const resultado = await entregasModel.atualizarEntrega(id,valor_distancia ?? e.valor_distancia,valor_peso ?? e.valor_peso,acrescimo ?? e.acrescimo,desconto ?? e.desconto,taxa_extra ?? e.taxa_extra,valor_final ?? e.valor_final,status_entrega ?? e.status_entrega,id_pedido_fk ?? e.id_pedido_fk);

            if (resultado.changedRows === 0) {
                throw new Error('Nenhuma alteração realizada.');
            }

            res.status(200).json({message: 'Entrega atualizada!',data: resultado
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno',errorMessage: error.message });
        }
    },

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
                return res.status(200).json({message: 'Entrega excluída com sucesso.', data: resultado});
            }

            throw new Error('Erro ao excluir entrega.');

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno', errorMessage: error.message});
        }
    }
};

module.exports = { entregasController };
