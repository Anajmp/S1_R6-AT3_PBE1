const pool = require('../config/db');

const entregasModel = {

    /**
     * Insere uma nova entrega na tabela `entregas`.
     * @async
     * @function
     * @param {number} id_pedido_fk - ID do pedido relacionado à entrega.
     * @param {number} valor_distancia - Valor calculado da distância.
     * @param {number} valor_peso - Valor calculado do peso.
     * @param {number} acrescimo - Valor do acréscimo.
     * @param {number} desconto - Valor do desconto.
     * @param {number} taxa_extra - Valor da taxa extra.
     * @param {number} valor_final - Valor final da entrega.
     * @param {string} [status_entrega='Pendente'] - Status inicial da entrega.
     * @returns {Promise<Object>} Retorna informações sobre o comando executado (insert).
     */
    inserirEntrega: async (id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega = 'Pendente') => {
        // NOTE: Adicionei a coluna status_entrega na query.
        const sql = ` INSERT INTO entregas (id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Seleciona uma entrega pelo ID.
     * @async
     * @function
     * @param {number} id - ID da entrega.
     * @returns {Promise<Array<Object>>} Retorna um array contendo a entrega encontrada.
     */
    selecionarPorId: async (id) => {
        const sql = `SELECT * FROM entregas WHERE id_entrega = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },

    /**
     * Seleciona todas as entregas cadastradas.
     * @async
     * @function
     * @returns {Promise<Array<Object>>} Lista completa das entregas registradas.
     */
    selecionarTodas: async () => {
        const sql = `SELECT * FROM entregas`;
        const [rows] = await pool.query(sql);
        return rows;
    },
    
    /**
     * Atualiza os dados de uma entrega existente.
     * @async
     * @function
     */
    atualizarEntrega: async (id, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega, id_pedido_fk) => {
        const sql = `UPDATE entregas SET valor_distancia = ?, valor_peso = ?, acrescimo = ?, desconto = ?, taxa_extra = ?, valor_final = ?, status_entrega = ?, id_pedido_fk = ? WHERE id_entrega = ?`;
        const values = [valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega, id_pedido_fk, id];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Remove uma entrega pelo ID.
     * @async
     * @function
     */
    deleteEntrega: async (id) => {
        const sql = `DELETE FROM entregas WHERE id_entrega = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    }
};

module.exports = { entregasModel };