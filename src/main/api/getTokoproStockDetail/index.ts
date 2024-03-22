// import { pool } from '../../connection'
import ElectronStore from 'electron-store'
import { createPool, Pool } from 'mysql2/promise'
import { ConfigType, pool } from '../../connection';

const store = new ElectronStore()
const config = store.get('config') as ConfigType

const sqlQueryStockDetail = `
    SELECT tbbarang.Kode CAI, tbqty.KodeGudang WarehouseCode, tbqty.QtyReady Qty, '' Remarks 
    FROM tbbarang, tbqty 
    WHERE tbbarang.Kode=tbqty.KodeBarang 
    AND tbbarang.KodeMerk='MICHELIN'
`;

export const getTokoproStockDetail = async () => {
    let connection;
    try {
        const pool: Pool = createPool({ 
            host: config.dbHost,
            port: parseInt(config.dbPort || '3307'),
            user: config.dbUsername,
            password: config.dbPassword,
            database: config.dbName
        })
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
        await pool.end();
    }
}