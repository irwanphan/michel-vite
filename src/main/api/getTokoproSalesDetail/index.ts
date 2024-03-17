import { pool } from '../../connection'

const sqlQuerySalesDetail = `
  SELECT tbt.KodePelanggan AS ADRegNo,
  tbpelanggan.Nama AS ADCustomerName,
  'IV' AS DocType,
  DATE_FORMAT(tbt.TglForm, '%Y%m%d') AS InvoiceDate,
  tbt.NoForm AS InvoiceNo,
  tbitem.NoItem AS ItemNo,
  tbitem.KodeBarang AS PartNumber,
  tbitem.NamaBarang AS PartDesc,
  tbitem.KodeBarang AS CAI,
  tbitem.Qty AS Qty 
  FROM tbfakturjual tbt, tbfakturjual_item tbitem, tbpelanggan, tbbarang   
  WHERE tbt.NoForm=tbitem.NoForm 
  AND tbt.KodePelanggan=tbpelanggan.Kode 
  AND tbitem.KodeBarang=tbbarang.Kode 
  AND tbbarang.KodeMerk='MICHELIN'
  AND tbt.TglForm>='2023-12-01' 
  AND tbt.TglForm<='2023-12-31'
`;

export const getTokoproSalesDetail = async () => {
    let connection;
    try {
        connection = await pool.getConnection();
        const salesDetail = await connection.query(sqlQuerySalesDetail);
        // console.log('rows', salesDetail[0]);
        return salesDetail[0];
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}