const pool = require('../config/db');

const entregasModel = {

    selecionarTodas: async () => {
        const sql = 'SELECT * FROM entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selecionarPorId: async (pid) => {
        const sql = 'SELECT * FROM entregas WHERE id_entrega = ?;';
        const [rows] = await pool.query(sql, [pid]);
        return rows;
    },

    selecionarPorPedido: async (pidPedido) => {
        const sql = 'SELECT * FROM entregas WHERE id_pedido_fk = ?;';
        const [rows] = await pool.query(sql, [pidPedido]);
        return rows;
    },

    inserirEntrega: async (pvalor_distancia,pvalor_peso,pacrescimo,pdesconto,ptaxa_extra,pvalor_final,pstatus,pid_pedido_fk) => {
        const sql = `INSERT INTO entregas (valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, status_entrega, id_pedido_fk VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
        const values = [pvalor_distancia, pvalor_peso, pacrescimo,pdesconto, ptaxa_extra, pvalor_final,pstatus, pid_pedido_fk];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    atualizarEntrega: async (pid,pvalor_distancia,pvalor_peso,pacrescimo,pdesconto,ptaxa_extra,pvalor_final,pstatus,pid_pedido_fk) => {
        const sql = `UPDATE entregas SET valor_distancia=?, valor_peso=?, acrescimo=?, desconto=?, taxa_extra=?, valor_final=?, status_entrega=?, id_pedido_fk=?WHERE id_entrega=?;`;
        const values = [pvalor_distancia, pvalor_peso, pacrescimo,pdesconto, ptaxa_extra, pvalor_final,pstatus, pid_pedido_fk, pid];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    deleteEntrega: async (pid) => {
        const sql = 'DELETE FROM entregas WHERE id_entrega = ?;';
        const [rows] = await pool.query(sql, [pid]);
        return rows;
    }
};

module.exports = { entregasModel };
