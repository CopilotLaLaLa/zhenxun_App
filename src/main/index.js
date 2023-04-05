import { app, shell, BrowserWindow, ipcMain, Menu, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.jpg?asset'

app.disableHardwareAcceleration()

// const axios = require('axios')

export function createCloseTipWindow(mainWindow) {
  // Create the browser window.
  const CloseTipWindow = new BrowserWindow({
    parent: mainWindow,
    width: 500,
    height: 300,
    show: false,
    frame: false,
    resizable: false,
    title: '真寻的小房间',
    icon,
    modal: true,
    // ...( true == 1 ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  CloseTipWindow.on('ready-to-show', () => {
    CloseTipWindow.show()
  })

  CloseTipWindow.on('closeWindow', () => {
    CloseTipWindow.close()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    // CloseTipWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    CloseTipWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/closeTip.html`)
  } else {
    CloseTipWindow.loadFile(join(__dirname, './closeTip.html'))
  }
}

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    show: false,
    frame: false,
    resizable: false,
    title: '真寻的小房间',
    icon,
    // ...( true == 1 ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  ipcMain.on('closeWindow', () => {
    createCloseTipWindow(mainWindow)
    // mainWindow.close()
  })
  ipcMain.on('minimizeWindow', () => {
    if (!mainWindow.isMinimized()) {
      mainWindow.minimize()
    }
  })

  ipcMain.on('cancleCloseTipWindow', () => {
    BrowserWindow.getFocusedWindow().close()
  })

  ipcMain.on('closeTipWindow', () => {
    mainWindow.close()
  })

  ipcMain.on('minTipWindow', () => {
    mainWindow.hide()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const tray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show',
      click: function () {
        mainWindow.show()
      }
    },
    {
      label: 'Hide',
      click: function () {
        mainWindow.hide()
      }
    },
    {
      label: 'Exit',
      click: function () {
        mainWindow.close()
      }
    }
  ])
  tray.setToolTip('真寻的小房间')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
  })
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  // const formData = new URLSearchParams()
  // formData.append('username', 'admin')
  // formData.append('password', 'password')
  // const params = {
  //   username: 'admin',
  //   password: 'password'
  // }

  // axios
  //   .post('http://150.158.16.59:8080/zhenxun/api/login', formData, {
  //     headers: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     }
  //   })
  //   .then((res) => {
  //     console.log(res.data)
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    // mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/api`)
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
