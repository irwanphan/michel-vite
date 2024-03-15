import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import mysql from 'mysql2'
require('dotenv').config()

const databaseConfig = {
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DATABASE: process.env.DB_DATABASE
}

const connection = mysql.createConnection({
  host: databaseConfig.HOST,
  port: parseInt(databaseConfig.PORT || '3307'),
  user: databaseConfig.USER,
  password: databaseConfig.PASSWORD,
  database: databaseConfig.DATABASE
})
connection.connect((error) => {
  if (error) {
    console.error('Database connection failed: ', error)
    app.quit()
  } else {
    console.log('Database connected successfully')
  }
})

const sqlQuerySales = `
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

const requestSalesData = async () => {
  try {
    const rows = await connection.query(sqlQuerySales, (error, results) => {
      if (error) {
        console.error('Error fetching data from database', error)
      }
      console.log('results', results)
    })
    console.log('rows', rows)
  } catch (error) {
    console.error('Error fetching data from database', error)
  }
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => {
    requestSalesData()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
