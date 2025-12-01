const { clientesModel } = require('../models/clientesModel');

const clientesController = {

    buscarTodosClientes: async (req, res) => {
        try {
            const resultado = await clientesModel.selecionarTodos();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Nenhum cliente cadastrado.' });
            }

            res.status(200).json({ message: 'Clientes encontrados', data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno no servidor.',errorMessage: error.message});
        }
    },

    buscarClientePorID: async (req, res) => {
        try {
            const id = Number(req.params.idCliente);
            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const resultado = await clientesModel.selecionarPorId(id);
            if (resultado.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            res.status(200).json({ message: 'Cliente encontrado', data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno', errorMessage: error.message });
        }
    },

    incluirCliente: async (req, res) => {
        try {
            const { nome_completo, cpf, telefone, email, endereco_completo } = req.body;

            if (!nome_completo || nome_completo.length < 3 || !cpf || cpf.length < 11 || !telefone || !email || !endereco_completo) {
                return res.status(400).json({ message: 'Dados inválidos para cadastro.' });
            }

            const existeCPF = await clientesModel.selecionarPorCPF(cpf);
            if (existeCPF.length === 1) {
                return res.status(409).json({ message: 'CPF já esta cadastrado.' });
            }
            const resultado = await clientesModel.inserirCliente(nome_completo, cpf, telefone, email, endereco_completo);

            if (resultado.affectedRows === 1 && resultado.insertId != 0) {
                res.status(201).json({message: 'Cliente cadastrado com sucesso',result: resultado});
            } else {
                throw new Error('Erro ao inserir cliente.');
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno no servidor.',errorMessage: error.message});
        }
    },

    atualizarCliente: async (req, res) => {
        try {
            const id = Number(req.params.idCliente);
            const { nome_completo, cpf, telefone, email, endereco_completo } = req.body;

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const clienteAtual = await clientesModel.selecionarPorId(id);
            if (clienteAtual.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            const novoNome = nome_completo ?? clienteAtual[0].nome_completo;
            const novoCPF = cpf ?? clienteAtual[0].cpf;
            const novoTelefone = telefone ?? clienteAtual[0].telefone;
            const novoEmail = email ?? clienteAtual[0].email;
            const novoEndereco = endereco_completo ?? clienteAtual[0].endereco_completo;

            const resultado = await clientesModel.alterarCliente(id, novoNome, novoCPF, novoTelefone, novoEmail, novoEndereco);
            if (resultado.changedRows === 0) {
                throw new Error('Nenhuma alteração realizada.');
            }

            res.status(200).json({message: 'Cliente atualizado com sucesso.',data: resultado});

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno', errorMessage: error.message });
        }
    },

    deleteCliente: async (req, res) => {
        try {
            const id = Number(req.params.idCliente);

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const existe = await clientesModel.selecionarPorId(id);
            if (!existe.length) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            const resultado = await clientesModel.deleteCliente(id);

            if (resultado.affectedRows === 1) {
                res.status(200).json({message: 'Cliente removido com sucesso.',data: resultado});
            } else {
                throw new Error('Falha ao excluir cliente.');
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno', errorMessage: error.message });
        }
    }
};

module.exports = { clientesController };
