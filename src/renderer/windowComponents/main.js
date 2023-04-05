import { BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon.jpg?asset'

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
      preload: join(__dirname, './preload/index.js'),
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

  ipcMain.on('cancleCloseTipWindow', () => {
    CloseTipWindow.close()
  })
  ipcMain.on('closeTipWindow', () => {
    mainWindow.close()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    CloseTipWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    // CloseTipWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/closeTip/index.html`)
  } else {
    CloseTipWindow.loadFile(join(__dirname, './closeTip/index.html'))
  }
//   CloseTipWindow.loadFile(
//     join(__dirname, '../../src/renderer/windowComponents/closeTip/index.html')
//   )
}
