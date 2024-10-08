import ElectronStore from 'electron-store'
import { createPool, Pool } from 'mysql2/promise'
import { ConfigType } from '../../ConfigType';

// tbqty.KodeGudang WarehouseCode,
const sqlQueryStockDetail = `
    SELECT 
        tbbarang.Kode CAI, 
        'W01' WarehouseCode,
        CAST(tbqty.QtyReady AS UNSIGNED) Qty,
        '' Remarks 
    FROM tbbarang, tbqty 
    WHERE 
        (tbbarang.KodeMerk='MICHELIN' OR tbbarang.KodeMerk='BFG')
        AND tbbarang.Kode=tbqty.KodeBarang 
`;

export const getTokoproStockDetail = async () => {
    const store = new ElectronStore()
    let config = store.get('config') as ConfigType

    let connection;
    let pool: Pool;
    try {
        pool = createPool({ 
            host: config.dbHost,
            port: parseInt(config.dbPort || '3307'),
            user: config.dbUsername,
            password: config.dbPassword,
            database: config.dbName
        })
        connection = await pool.getConnection();
        const stockDetail = await connection.query(sqlQueryStockDetail);
        console.log('rows', stockDetail[0]);
        return stockDetail[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) { await connection.release(); }
        await pool!.end();
    }
}