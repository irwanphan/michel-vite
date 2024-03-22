import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getTokoproSalesDetail } from './api/getTokoproSalesDetail'
import { getTokoproStockDetail } from './api/getTokoproStockDetail'
import { getSalesDetailUrl, headers, submitSalesDetailUrl, submitStockDetailUrl } from './helpers/endpoints'
import ElectronStore from 'electron-store'
// import { databaseConfig } from './connection'

const store = new ElectronStore()

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 480,
    height: 640,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    icon: icon
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

  // hit getSalesDetailUrl, send to renderer
  ipcMain.on('get-sales-detail', async (event) => {
    try {
      const response = await fetch(getSalesDetailUrl, {
        method: "GET",
        headers: headers
      })
      const jsonBody = await response.json();
      const reply = {
        response: jsonBody,
        status: response.status,
        statusText: response.statusText
      }
      event.reply('get-sales-detail-reply', reply);
  
    } catch (error) {
      throw error;
    }
  })
  
  // IPC Submit Sales Detail
  ipcMain.handle('submit-sales-detail', async (_event) => {
    try {
      console.log('processing request ...')
      const salesDetail = await getTokoproSalesDetail();
      // console.log('salesDetail', salesDetail);

      // Send HTTP PUT request
      const response = await fetch(submitSalesDetailUrl, {
        method: 'PUT',
        body: JSON.stringify(salesDetail),
        headers: headers,
      })
      const jsonBody = await response.json();
      const lastSalesUpdate = new Date().toLocaleString("id-ID");

      const reply = {
        response: jsonBody,
        status: response.status,
        statusText: response.statusText,
        lastSalesUpdate: lastSalesUpdate
      }
      store.set('lastSalesUpdate', lastSalesUpdate);
      console.log('done')

      // event.reply('submit-sales-detail-reply', reply);
      return reply;
    } catch (error: any) {
      throw (`Error submitting: ${error.message}`);
    }
  })

  // IPC Submit Stock Detail
  ipcMain.handle('submit-stock-detail', async (_event) => {
    try {
      console.log('processing request ...')
      const stockDetail = await getTokoproStockDetail();
      // console.log('stockDetail', stockDetail);

      // Send HTTP PUT request
      const response = await fetch(submitStockDetailUrl, {
        method: 'PUT',
        body: JSON.stringify(stockDetail),
        headers: headers,
      })
      const jsonBody = await response.json();
      const lastStockUpdate = new Date().toLocaleString('id-ID');

      const reply = {
        response: jsonBody,
        status: response.status,
        statusText: response.statusText,
        lastStockUpdate: lastStockUpdate
      }
      store.set('lastStockUpdate', lastStockUpdate);
      console.log('done')

      // event.reply('submit-stock-detail-reply', reply);
      return reply;
    } catch (error:any) {
      throw (`Error submitting: ${error.message}`);
    }
  })

  ipcMain.handle('save-config', async (_event, arg) => {
    try {
      store.set('config', arg);
    } catch (error: any) {
      throw error.message;
    }
  })

  ipcMain.handle('get-config', async (_event) => {
    try {
      const reply = store.get('config');
      return reply;
    } catch (error: any) {
      throw error.message;
    } 
  })

  ipcMain.handle('get-last-updates', async (_event) => {
    try {
      const lastSalesUpdate = store.get('lastSalesUpdate');
      const lastStockUpdate = store.get('lastStockUpdate');
      const reply = {
        lastSalesUpdate,
        lastStockUpdate
      }
      // event.reply('get-last-updates-reply', reply);
      return reply;
    } catch (error:any) {
      throw (`Error fetch: ${error.message}`);
    }
  })

  createWindow()
  
  console.log('app is ready')
  // console.log('databaseConfig', databaseConfig)

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
