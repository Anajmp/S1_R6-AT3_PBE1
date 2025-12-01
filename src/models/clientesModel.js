const pool = require('../config/db');

const clientesModel = {

    /**
     * Seleciona todos os clientes cadastrados na tabela.
     * @async
     * @function
     * @returns {Promise<Array<Object>>} Retorna um array de objetos representando cada cliente.
     * 
     * @example
     * const clientes = await clientesModel.selecionarTodos();
     * // Saída esperada:
     * [
     *   { id_cliente: 1, nome_completo:'Ana', cpf:'12345678900', telefone:'...'},
     *   { id_cliente: 2, nome_completo:'Marcos', cpf:'98765432100', telefone:'...'}
     * ]
     */
    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    /**
     * Seleciona um cliente específico pelo ID.
     * @async
     * @param {number} pid_cliente - ID do cliente a ser consultado.
     * @returns {Promise<Array<Object>>} Retorna um array contendo o cliente encontrado.
     * 
     * @example
     * const cliente = await clientesModel.selecionarPorId(1);
     * // Saída:
     * [
     *   { id_cliente:1, nome_completo:'Ana', cpf:'12345678900', ... }
     * ]
     */
    selecionarPorId: async (pid_cliente) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?;';
        const [rows] = await pool.query(sql, [pid_cliente]);
        return rows;
    },

    /**
     * Seleciona um cliente pelo CPF.
     * @async
     * @param {string} pcpf - CPF do cliente.
     * @returns {Promise<Array<Object>>} Retorna um array contendo o cliente correspondente.
     * 
     * @example
     * const cliente = await clientesModel.selecionarPorCPF("12345678900");
     */
    selecionarPorCPF: async (pcpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?;';
        const [rows] = await pool.query(sql, [pcpf]);
        return rows;
    },

    /**
     * Insere um novo cliente na tabela.
     * @async
     * @param {string} pnome - Nome completo.
     * @param {string} pcpf - CPF do cliente.
     * @param {string} ptelefone - Número de telefone.
     * @param {string} pemail - Email.
     * @param {string} pnumero - Número da casa.
     * @param {string} pbairro - Bairro.
     * @param {string} pcidade - Cidade.
     * @param {string} pestado - Sigla do estado.
     * @param {string} pcep - CEP.
     * @param {string} plogradouro - Nome da rua / logradouro.
     * @returns {Promise<Object>} Retorna informações do comando executado.
     * 
     * @example
     * const result = await clientesModel.inserirCliente(
     *   "Ana Maria", "12345678900", "99999-9999", "ana@mail.com",
     *   "100", "Centro", "Sorocaba", "SP", "18000-000", "Rua A"
     * );
     * // Exemplo de saída:
     * {
     *   affectedRows: 1,
     *   insertId: 3,
     *   warningStatus: 0
     * }
     */
    inserirCliente: async (pnome, pcpf, ptelefone, pemail, pnumero, pbairro, pcidade, pestado, pcep, plogradouro) => {
        const sql = `INSERT INTO clientes (nome_completo, cpf, telefone, email, numero_casa, bairro_cliente, cidade_cliente, estado_sigla_cliente, cep_cliente, logradouro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

        const values = [pnome, pcpf, ptelefone, pemail, pnumero, pbairro, pcidade, pestado, pcep, plogradouro];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Atualiza os dados de um cliente existente.
     * @async
     * @param {number} pid - ID do cliente.
     * @param {string} pnome
     * @param {string} pcpf
     * @param {string} ptelefone
     * @param {string} pemail
     * @param {string} pnumero
     * @param {string} pbairro
     * @param {string} pcidade
     * @param {string} pestado
     * @param {string} pcep
     * @param {string} plogradouro
     * @returns {Promise<Object>} Retorna informações sobre o update.
     * 
     * @example
     * const result = await clientesModel.alterarCliente(
     *   1, "Ana Maria", "12345678900", "99999-9999", "ana@mail.com",
     *   "200", "Vila Nova", "Sorocaba", "SP", "18000-100", "Rua B"
     * );
     */
    alterarCliente: async (pid, pnome, pcpf, ptelefone, pemail, pnumero, pbairro, pcidade, pestado, pcep, plogradouro) => {
        const sql = `UPDATE clientes SET nome_completo=?, cpf=?, telefone=?, email=?, numero_casa=?,bairro_cliente=?, cidade_cliente=?, estado_sigla_cliente=?, cep_cliente=?, logradouro=? WHERE id_cliente=?;`;

        const values = [pnome, pcpf, ptelefone, pemail, pnumero, pbairro, pcidade, pestado, pcep, plogradouro, pid];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Deleta um cliente pelo ID.
     * @async
     * @param {number} pid_cliente - ID do cliente a ser deletado.
     * @returns {Promise<Object>} Informações do delete executado.
     * 
     * @example
     * const resultado = await clientesModel.deleteCliente(5);
     * // Resultado esperado:
     * { affectedRows: 1 }
     */
    deleteCliente: async (pid_cliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?;';
        const [rows] = await pool.query(sql, [pid_cliente]);
        return rows;
    },

    consultar: async (sql, params = []) => {
    const [rows] = await pool.query(sql, params);
    return rows;
},

};

module.exports = { clientesModel };
