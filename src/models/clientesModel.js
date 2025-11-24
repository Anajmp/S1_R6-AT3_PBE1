const pool = require('../config/db');

const clientesModel = {

    selecionarTodos: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selecionarPorId: async (pid_cliente) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?;';
        const values = [pid_cliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selecionarPorCPF: async (pcpf) => {
        const sql = 'SELECT * FROM clientes WHERE cpf = ?;';
        const values = [pcpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    inserirCliente: async (pnome, pcpf, ptelefone, pemail, pendereco) => {
        const sql = ` INSERT INTO clientes (nome_completo, cpf, telefone, email, endereco_completo) VALUES (?, ?, ?, ?, ?);`;
        const values = [pnome, pcpf, ptelefone, pemail, pendereco];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    alterarCliente: async (pid, pnome, pcpf, ptelefone, pemail, pendereco) => {
        const sql = `UPDATE clientes SET nome_completo=?, cpf=?, telefone=?, email=?, endereco_completo=? WHERE id_cliente=?;`;
        const values = [pnome, pcpf, ptelefone, pemail, pendereco, pid];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    deleteCliente: async (pid_cliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?;';
        const values = [pid_cliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

};

module.exports = { clientesModel };
