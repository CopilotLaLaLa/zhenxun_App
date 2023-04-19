'use strict'
const { app, ipcMain } = require('electron')
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
import { readSettings, saveSettings } from './configuration'

const DialogWindow = require('./controllers/dialog')
const MainWindow = require('./controllers/mainW')
const SettingsWindow = require('./controllers/settings')
const AppTray = require('./controllers/app_tray')

class ElectronicMain {
  constructor() {
    this.loginWindow = null
    this.mainWindow = null
    this.settingsWindow = null
    this.dialogWindow = null
    this.tray = null
  }

  init() {
    if (this.checkInstance()) {
      this.initApp()
      this.initIPC()
    } else {
      app.quit()
    }
  }
  checkInstance() {
    //如果当前进程是应用程序的主要实例，则此方法返回true
    const gotTheLock = app.requestSingleInstanceLock()

    if (gotTheLock) {
      app.on('second-instance', () => {
        if (this.dialogWindow && this.dialogWindow.isShown) {
          this.dialogWindow.show()
        }
        if (this.loginWindow) {
          this.loginWindow.show()
        }
        if (this.mainWindow) {
          this.mainWindow.show()
        }
        if (this.settingsWindow && this.settingsWindow.isShown) {
          this.settingsWindow.show()
        }
      })
    }
    return gotTheLock
  }
  initApp() {
    app.on('ready', () => {
      this.createMainWindow()
      this.createTray(this.mainWindow)

      if (!readSettings('language')) {
        saveSettings('language', 'zh-CN')
      }
    })

    app.on('activate', () => {
      if (this.mainWindow == null) {
        this.createMainWindow()
      } else {
        console.log('activate')
        this.mainWindow.show()
      }
    })

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })
  }

  initIPC() {
    ipcMain.on('open-main-window', () => {
      if (this.mainWindow) {
        this.mainWindow.show()
      } else {
        this.createMainWindow()
        this.mainWindow.show()
      }
    })
    ipcMain.on('hide-main-window', () => {
      this.mainWindow.hide()
    })
    ipcMain.on('minimize-main-window', () => {
      this.mainWindow.minimize()
    })
    ipcMain.on('close-main-window', () => {
      this.createDialogWindow(this.mainWindow.mainWindow, this.tray)
    })
    ipcMain.on('ok-dialog-window', (event, message) => {
      if (message == 'cmd' && this.mainWindow != null) {
        this.mainWindow.close()
        this.mainWindow = null
      }
      this.dialogWindow.close()
      this.dialogWindow = null
    })
    ipcMain.on('cancel-dialog-window', () => {
      this.dialogWindow.close()
      this.dialogWindow = null
    })
    ipcMain.on('open-login-window', () => {
      if (this.loginWindow) {
        this.loginWindow.show()
      } else {
        this.createLoginWindow()
        this.loginWindow.show()
      }
    })
    ipcMain.on('close-login-window', () => {
      this.loginWindow.close()
      this.loginWindow = null
    })
    ipcMain.on('open-settings-window', () => {
      if (this.settingsWindow) {
        this.settingsWindow.show()
      } else {
        this.createSettingsWindow()
        this.settingsWindow.show()
      }
    })
    ipcMain.on('close-settings-window', () => {
      this.settingsWindow.close()
      this.settingsWindow = null
    })
  }

  createTray(mainWindow) {
    this.tray = new AppTray(mainWindow)
  }

  createDialogWindow(fatherWindow, tray) {
    this.dialogWindow = new DialogWindow(fatherWindow, tray)
  }

  createMainWindow() {
    this.mainWindow = new MainWindow()
  }

  createSettingsWindow() {
    this.settingsWindow = new SettingsWindow()
  }
}

new ElectronicMain().init()
