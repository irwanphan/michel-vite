import ElectronStore from 'electron-store'
import { createPool, Pool } from 'mysql2/promise'
import { ConfigType } from '../../ConfigType';

        // tbt.KodePelanggan ADRegNo,
        // FROM tbfakturjual tbt, tbfakturjual_item tbitem, tbpelanggan, tbbarang   
        // WHERE 
        // tbt.NoForm=tbitem.NoForm 
        // AND tbt.KodePelanggan=tbpelanggan.Kode 
        // AND tbitem.KodeBarang=tbbarang.Kode 
        // AND tbbarang.KodeMerk='MICHELIN' OR tbbarang.KodeMerk='BFG' 
        // AND tbt.TglForm>=IF(DAY(CURDATE())<=5,DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'),DATE_FORMAT(CURDATE(), '%Y-%m-06'))
        // AND tbt.TglForm<=IF(DAY(CURDATE())<=5,DATE_FORMAT(CURDATE(),'%Y-%m-05'),LAST_DAY(CURDATE()))

        // (tbbarang.KodeMerk='MICHELIN' OR tbbarang.KodeMerk='BFG')
        // AND tbt.TglForm >= IF(DAY(CURDATE()) <= 5, DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'), DATE_FORMAT(CURDATE(), '%Y-%m-06'))
        // AND tbt.TglForm <= IF(DAY(CURDATE()) <= 5, DATE_FORMAT(CURDATE(),'%Y-%m-05'), LAST_DAY(CURDATE()));

const sqlQuerySalesDetail = `
    SELECT 
        tbpelanggan.add1 ADRegNo, 
        tbpelanggan.Nama ADCustomerName, 
        'IV' DocType, 
        DATE_FORMAT(tbt.TglForm,'%Y%m%d') InvoiceDate, 
        tbt.NoForm InvoiceNo, 
        CAST(tbitem.NoItem AS CHAR) ItemNo, 
        tbitem.KodeBarang PartNumber, 
        tbitem.NamaBarang PartDesc, 
        tbitem.KodeBarang CAI, 
        CAST(tbitem.Qty AS SIGNED) Qty
    FROM
        tbfakturjual tbt
        INNER JOIN tbfakturjual_item tbitem ON tbt.NoForm=tbitem.NoForm 
        INNER JOIN tbpelanggan ON tbt.KodePelanggan=tbpelanggan.Kode 
        INNER JOIN tbbarang ON tbitem.KodeBarang=tbbarang.Kode
    WHERE 
        (tbbarang.KodeMerk='MICHELIN' OR tbbarang.KodeMerk='BFG')
        AND tbt.TglForm >= IF(DAY(CURDATE()) <= 5, DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01'), DATE_FORMAT(CURDATE(), '%Y-%m-01'))
        AND tbt.TglForm <= IF(DAY(CURDATE()) <= 5, DATE_FORMAT(CURDATE(),'%Y-%m-05'), CURDATE());
`;

export const getTokoproSalesDetail = async () => {
    const store = new ElectronStore()
    const config = store.get('config') as ConfigType

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
        console.log('rows', salesDetail[0]);
        return salesDetail[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) { await connection.release(); }
        await pool!.end();
    }
}