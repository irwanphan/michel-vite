import { pool } from '../../connection'

// connection.connect((error:any) => {
//     if (error) {
//       console.error('Database connection failed: ', error)
//     } else {
//       console.log('Database connected successfully')
//     }
//   })

const sqlQueryStock = `
    SELECT tbbarang.Kode CAI, tbqty.KodeGudang WarehouseCode, tbqty.QtyReady Qty, '' Remarks 
    FROM tbbarang, tbqty 
    WHERE tbbarang.Kode=tbqty.KodeBarang 
    AND tbbarang.KodeMerk='MICHELIN'
`;

export const getStockData = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const stockData = await connection.query(sqlQueryStock);
        // console.log('rows', stockData[0]);
        return stockData[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}