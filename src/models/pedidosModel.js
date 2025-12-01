const pool = require('../config/db');

const pedidosModel = {

    /**
     * Insere um novo pedido na tabela `pedidos`.
     * @async
     * @function
     * @param {number} id_cliente_fk - ID do cliente relacionado ao pedido.
     * @param {string} data_pedido - Data do pedido (YYYY-MM-DD).
     * @param {string} tipo_entrega - Tipo da entrega ("normal" ou "urgente").
     * @param {number} distancia_km - Distância em quilômetros.
     * @param {number} peso_kg - Peso da carga em quilogramas.
     * @param {number} valor_base_km - Valor cobrado por quilômetro.
     * @param {number} valor_base_kg - Valor cobrado por quilo.
     * @returns {Promise<Object>} Retorna informações sobre o comando executado (insert).
     * 
     * @example
     * const result = await pedidosModel.inserirPedido(
     *   1, "2025-11-25", "urgente", 30, 12, 2.5, 4.0
     * );
     * // Saída esperada:
     * {
     *   affectedRows: 1,
     *   insertId: 10,
     *   warningStatus: 0
     * }
     */
    inserirPedido: async (id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_base_km, valor_base_kg) => {
        const sql = ` INSERT INTO pedidos (id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_base_km, valor_base_kg) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_base_km, valor_base_kg ];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * Seleciona um pedido pelo ID.
     * @async
     * @function
     * @param {number} id - ID do pedido.
     * @returns {Promise<Array<Object>>} Retorna um array contendo o pedido encontrado.
     * 
     * @example
     * const pedido = await pedidosModel.selecionarPorId(3);
     * // Saída:
     * [
     *   {
     *     id_pedido: 3,
     *     id_cliente_fk: 1,
     *     tipo_entrega: "normal",
     *     distancia_km: 20,
     *     peso_kg: 10,
     *     ...
     *   }
     * ]
     */
    selecionarPorId: async (id) => {
        const sql = `SELECT * FROM pedidos WHERE id_pedido = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },

    /**
     * Seleciona todos os pedidos cadastrados.
     * @async
     * @function
     * @returns {Promise<Array<Object>>} Lista completa dos pedidos registrados.
     * 
     * @example
     * const lista = await pedidosModel.selecionarTodos();
     * // Saída:
     * [
     *   {...pedido1},
     *   {...pedido2},
     *   {...pedido3}
     * ]
     */
    selecionarTodos: async () => {
        const sql = `SELECT * FROM pedidos`;
        const [rows] = await pool.query(sql);
        return rows;
    }
};

module.exports = { pedidosModel };
