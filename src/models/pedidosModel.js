const pool = require('../config/db');

const pedidosModel = {
    inserirPedido: async (
        id_cliente_fk,
        data_pedido,
        tipo_entrega,
        distancia_km,
        peso_kg,
        valor_base_km,
        valor_base_kg
    ) => {
        const sql = `INSERT INTO pedidos (id_cliente_fk, data_pedido, tipo_entrega, distancia_km, peso_kg, valor_base_km, valor_base_kg) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const values = [
            id_cliente_fk,
            data_pedido,
            tipo_entrega,
            distancia_km,
            peso_kg,
            valor_base_km,
            valor_base_kg
        ];

        const [rows] = await pool.query(sql, values);
        return rows;
    },

    selecionarPorId: async (id) => {
        const sql = `SELECT * FROM pedidos WHERE id_pedido = ?`;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },

    selecionarTodos: async () => {
        const sql = `SELECT * FROM pedidos`;
        const [rows] = await pool.query(sql);
        return rows;
    }
};

module.exports = { pedidosModel };
