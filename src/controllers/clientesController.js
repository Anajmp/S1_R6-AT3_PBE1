const { clientesModel } = require('../models/clientesModel');

const clientesController = {

    /**
     * Retorna todos os clientes cadastrados na base de dados.
     * Rota: GET /clientes
     * @async
     * @function buscarTodosClientes
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<object>>} Lista de clientes cadastrados ou mensagem informando que não há dados
     */
    buscarTodosClientes: async (req, res) => {
        try {
            const resultado = await clientesModel.selecionarTodos();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'Nenhum cliente cadastrado.' });
            }

            res.status(200).json({ message: 'Clientes encontrados', data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Erro interno no servidor.', errorMessage: error.message});
        }
    },

    /**
     * Busca um cliente específico pelo ID informado na requisição.
     * Rota: GET /clientes/:idCliente
     * @async
     * @function buscarClientePorID
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object>} Dados do cliente encontrado ou erro caso não exista
     */
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

    /**
     * Insere um novo cliente no banco de dados.
     * Rota: POST /clientes
     * @async
     * @function incluirCliente
     * @param {Request} req Objeto da requisição HTTP com os dados do cliente
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object>} Resultado da operação de inserção
     */
    incluirCliente: async (req, res) => {
        try {
            const { nome_completo, cpf, telefone, email, numero_casa, bairro_cliente, cidade_cliente, estado_sigla_cliente, cep_cliente, logradouro } = req.body;

            if (!nome_completo || !cpf || !telefone || !email || !numero_casa || !bairro_cliente || !cidade_cliente ||!estado_sigla_cliente || !cep_cliente || !logradouro) {
                return res.status(400).json({ message: 'Dados incompletos para cadastro.' });
            }

            const existeCPF = await clientesModel.selecionarPorCPF(cpf);
            if (existeCPF.length === 1) {
                return res.status(409).json({ message: 'CPF já está cadastrado.' });
            }

            const resultado = await clientesModel.inserirCliente( nome_completo, cpf, telefone, email,numero_casa, bairro_cliente, cidade_cliente, estado_sigla_cliente, cep_cliente, logradouro );

            if (resultado.affectedRows === 1) {
                res.status(201).json({ message: 'Cliente cadastrado com sucesso', result: resultado });
            } else {
                throw new Error('Erro ao inserir cliente.');
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno no servidor.', errorMessage: error.message });
        }
    },

    /**
     * Atualiza os dados de um cliente existente.
     * Rota: PUT /clientes/:idCliente
     * @async
     * @function atualizarCliente
     * @param {Request} req Objeto da requisição HTTP com o ID e os novos dados
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<object>} Resultado da operação de atualização
     */
    atualizarCliente: async (req, res) => {
        try {
            const id = Number(req.params.idCliente);
            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({ message: 'ID inválido' });
            }

            const clienteAtual = await clientesModel.selecionarPorId(id);
            if (clienteAtual.length === 0) {
                return res.status(404).json({ message: 'Cliente não encontrado' });
            }

            const { nome_completo, cpf, telefone, email, numero_casa, bairro_cliente, cidade_cliente, estado_sigla_cliente, cep_cliente, logradouro } = req.body;

            const atual = clienteAtual[0];

            const resultado = await clientesModel.alterarCliente(
                id,
                nome_completo ?? atual.nome_completo,
                cpf ?? atual.cpf,
                telefone ?? atual.telefone,
                email ?? atual.email,
                numero_casa ?? atual.numero_casa,
                bairro_cliente ?? atual.bairro_cliente,
                cidade_cliente ?? atual.cidade_cliente,
                estado_sigla_cliente ?? atual.estado_sigla_cliente,
                cep_cliente ?? atual.cep_cliente,
                logradouro ?? atual.logradouro
            );

            if (resultado.changedRows === 0) {
                throw new Error('Nenhuma alteração realizada.');
            }

            res.status(200).json({ message: 'Cliente atualizado com sucesso.', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro interno', errorMessage: error.message });
        }
    },

/**
 * Exclui um cliente somente se não houver registros vinculados.
 * Antes da remoção, verifica se o cliente possui pedidos ou entregas associadas.
 * Caso exista qualquer vínculo, a exclusão é bloqueada.
 *
 * Rota: DELETE /clientes/:idCliente
 *
 * @async
 * @function deleteCliente
 * @param {Request} req Objeto da requisição HTTP contendo o ID do cliente.
 * @param {Response} res Objeto da resposta HTTP usado para enviar o retorno.
 * @returns {Promise<object>} Mensagem de sucesso ao remover, ou mensagem de bloqueio caso existam vínculos.
 */

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

        // Verifica pedidos vinculados
        const pedidos = await clientesModel.consultar(`SELECT id_pedido FROM pedidos WHERE id_cliente_fk = ? LIMIT 1`, [id]);

        if (pedidos.length > 0) {
            return res.status(409).json({
                message: 'Cliente possui pedidos vinculados e não pode ser excluído.'
            });
        }

        // Verifica entregas vinculadas
        const entregas = await clientesModel.consultar(`SELECT e.id_entrega FROM entregas eJOIN pedidos p ON p.id_pedido = e.id_pedido_fk WHERE p.id_cliente_fk = ? LIMIT 1`, [id]);

        if (entregas.length > 0) {
            return res.status(409).json({
                message: 'Cliente possui entregas vinculadas e não pode ser excluído.'
            });
        }

        const resultado = await clientesModel.deleteCliente(id);

        if (resultado.affectedRows === 1) {
            return res.status(200).json({ message: 'Cliente removido com sucesso.' });
        }

        throw new Error('Falha ao excluir cliente.');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno', errorMessage: error.message });
    }
}


};

module.exports = { clientesController };
