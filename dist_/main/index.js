"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const promise = require("mysql2/promise");
const icon = path.join(__dirname, "../../resources/icon.png");
require("dotenv").config();
const databaseConfig = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DB_DATABASE
};
const pool = promise.createPool({
  host: databaseConfig.HOST,
  port: parseInt(databaseConfig.PORT || "3307"),
  user: databaseConfig.USER,
  password: databaseConfig.PASSWORD,
  database: databaseConfig.DATABASE
});
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
const getTokoproSalesDetail = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const salesDetail = await connection.query(sqlQuerySalesDetail);
    return salesDetail[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
const sqlQueryStockDetail = `
    SELECT tbbarang.Kode CAI, tbqty.KodeGudang WarehouseCode, tbqty.QtyReady Qty, '' Remarks 
    FROM tbbarang, tbqty 
    WHERE tbbarang.Kode=tbqty.KodeBarang 
    AND tbbarang.KodeMerk='MICHELIN'
`;
const getTokoproStockDetail = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    const stockDetail = await connection.query(sqlQueryStockDetail);
    return stockDetail[0];
  } catch (error) {
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};
const date$1 = /* @__PURE__ */ new Date();
const year = date$1.getFullYear();
const month = (1 + date$1.getMonth()).toString().padStart(2, "0");
const day = date$1.getDate().toString().padStart(2, "0");
const hours = date$1.getHours().toString().padStart(2, "0");
const minutes = date$1.getMinutes().toString().padStart(2, "0");
const seconds = date$1.getSeconds().toString().padStart(2, "0");
const formatDate = () => {
  return `${year}${month}${day}`;
};
const formatDateTime = () => {
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};
const formatDateFYM = () => {
  return `FY${year}M${month}`;
};
const username = process.env.USER_NAME;
const password = process.env.USER_PASSWORD;
const encodedCredentials = btoa(`${username}:${password}`);
let headers = new Headers();
headers.set("Authorization", `Basic ${encodedCredentials}`);
headers.set("Content-Type", "application/json");
const DaytonReg = process.env.DAYTON_REG;
const DaytonSubCode = process.env.DAYTON_SUBCODE;
const date = formatDate();
const datetime = formatDateTime();
const dateFYM = formatDateFYM();
const submitSalesDetailUrl = `http://13.67.56.85:8510/RASUAT.WebAPI/SalesDetail/SubmitSalesDetail?RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransDate=${date}`;
const submitStockDetailUrl = `http://13.67.56.85:8510/RAS.WebAPI/Stock/SubmitStockDetail?RDBusinessRegNo=${DaytonReg}&RDFileCode=${DaytonSubCode}&TransDate=${datetime}`;
const getSalesDetailUrl = `http://redistributionapproach.michelin.com.my/RAS.WebAPI/SalesDetail/GetSalesDetail? 
RDBusinessRegNo=${DaytonReg}&RDSubCode=${DaytonSubCode}&TransMonth=${dateFYM}`;
const getSalesDetail = async () => {
  const salesDetail = await fetch(getSalesDetailUrl, {
    method: "GET"
  });
  return salesDetail;
};
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("get-sales-detail", async () => {
    const salesDetail = await getSalesDetail();
    console.log(salesDetail);
  });
  electron.ipcMain.on("submit-sales-detail", async () => {
    try {
      const salesDetail = await getTokoproSalesDetail();
      const response = await fetch(submitSalesDetailUrl, {
        method: "PUT",
        body: JSON.stringify(salesDetail),
        headers
      });
      const jsonBody = await response.json();
      console.log("response", jsonBody);
    } catch (error) {
      throw error;
    }
  });
  electron.ipcMain.on("submit-stock-detail", async () => {
    try {
      const stockDetail = await getTokoproStockDetail();
      console.log("stockDetail", stockDetail);
      const response = await fetch(submitStockDetailUrl, {
        method: "PUT",
        body: JSON.stringify(stockDetail),
        headers
      });
      const jsonBody = await response.json();
      console.log("response", jsonBody);
    } catch (error) {
      throw error;
    }
  });
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0)
      createWindow();
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
