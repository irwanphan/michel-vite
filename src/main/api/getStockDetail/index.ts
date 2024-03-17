import { pool } from '../../connection'

const sqlQueryStockDetail = `
    SELECT tbbarang.Kode CAI, tbqty.KodeGudang WarehouseCode, tbqty.QtyReady Qty, '' Remarks 
    FROM tbbarang, tbqty 
    WHERE tbbarang.Kode=tbqty.KodeBarang 
    AND tbbarang.KodeMerk='MICHELIN'
`;

export const getStockDetail = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const stockDetail = await connection.query(sqlQueryStockDetail);
        // console.log('rows', stockDetail[0]);
        return stockDetail[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}