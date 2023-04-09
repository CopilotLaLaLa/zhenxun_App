'use strict'
const { app, ipcMain, BrowserWindow } = require('electron')
const AppConfig = require('./configuration')

const DialogWindow = require('../windows/controllers/dialog')
const MainWindow = require('../windows/controllers/mainW')
const SettingsWindow = require('../windows/controllers/settings')
const AppTray = require('../windows/controllers/app_tray')

class ElectronicWeChat {
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
    return !gotTheLock
  }
  initApp() {
    app.on('ready', () => {
      this.createMainWindow()
      this.createTray()

      if (!AppConfig.readSettings('language')) {
        AppConfig.saveSettings('language', 'zh-CN')
      }
    })

    app.on('activate', () => {
      if (this.loginWindow == null) {
        this.createMainWindow()
      } else {
        this.loginWindow.show()
      }
    })
  }

  initIPC() {
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
    ipcMain.on('open-main-window', () => {
      if (this.mainWindow) {
        this.mainWindow.show()
      } else {
        this.createMainWindow()
        this.mainWindow.show()
      }
    })
    ipcMain.on('close-main-window', () => {
      this.mainWindow.close()
      this.mainWindow = null
    })
    ipcMain.on('open-dialog-window', () => {
      if (this.dialogWindow) {
        this.dialogWindow.show()
      } else {
        this.createDialogWindow(BrowserWindow.getFocusedWindow())
        this.dialogWindow.show()
      }
    })
    ipcMain.on('close-dialog-window', () => {
      this.dialogWindow.close()
      this.dialogWindow = null
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

  createTray() {
    this.tray = new AppTray(this.splashWindow, this.wechatWindow)
  }

  // creatLoginWindow() {
  //   this.loginWindow = new LoginWindow()
  // }

  createDialogWindow(fatherWindow) {
    this.dialogWindow = new DialogWindow(fatherWindow)
    this.dialogWindow.show()
  }

  createMainWindow() {
    this.mainWindow = new MainWindow()
  }

  createSettingsWindow() {
    this.settingsWindow = new SettingsWindow()
  }
}

new ElectronicWeChat().init()
