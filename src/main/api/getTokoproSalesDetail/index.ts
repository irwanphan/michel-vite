// import { pool } from '../../connection'
import ElectronStore from 'electron-store'
import { createPool, Pool } from 'mysql2/promise'
import { ConfigType } from '../../connection';

const store = new ElectronStore()
const config = store.get('config') as ConfigType

const sqlQuerySalesDetail = `
    SELECT tbt.KodePelanggan ADRegNo, 
        tbpelanggan.Nama ADCustomerName, 
        'IV' DocType, 
        DATE_FORMAT(tbt.TglForm,'%Y%m%d') InvoiceDate, 
        tbt.NoForm InvoiceNo, 
        tbitem.NoItem ItemNo, 
        tbitem.KodeBarang PartNumber, 
        tbitem.NamaBarang PartDesc, 
        tbitem.KodeBarang CAI, 
        tbitem.Qty Qty 
    FROM tbfakturjual tbt, tbfakturjual_item tbitem, tbpelanggan, tbbarang   
        WHERE tbt.NoForm=tbitem.NoForm 
        AND tbt.KodePelanggan=tbpelanggan.Kode 
        AND tbitem.KodeBarang=tbbarang.Kode 
        AND tbbarang.KodeMerk='MICHELIN'
        AND tbt.TglForm>=IF(DAY(CURDATE())<=5,DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'),DATE_FORMAT(CURDATE(), '%Y-%m-06'))
        AND tbt.TglForm<=IF(DAY(CURDATE())<=5,DATE_FORMAT(CURDATE(),'%Y-%m-05'),LAST_DAY(CURDATE()))
`;

export const getTokoproSalesDetail = async () => {
    let connection;
    let pool: Pool;
    try {
        pool= createPool({ 
            host: config.dbHost,
            port: parseInt(config.dbPort || '3307'),
            user: config.dbUsername,
            password: config.dbPassword,
            database: config.dbName
        })
        connection = await pool.getConnection();
        const salesDetail = await connection.query(sqlQuerySalesDetail);
        // console.log('rows', salesDetail[0]);
        return salesDetail[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) { await connection.release(); }
        await pool!.end();
    }
}