'use strict'
import { join } from 'path'
import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import { unregisterAll } from 'electron-localshortcut'
import icon from '../../../resources/icon.png?asset'
const AppConfig = require('../configuration')

const lan = AppConfig.readSettings('language')

let Common
if (lan === 'zh-CN') {
  Common = require('../../inject/config/common_cn')
} else {
  Common = require('../../inject/config/common')
}

class mainWindow {
  constructor() {
    this.createWindow()
    this.initWindowEvents()
    this.initWindowWebContent()
  }
  //重绘窗口
  resizeWindow() {}

  createWindow() {
    this.mainWindow = new BrowserWindow({
      title: Common.TITLE,
      width: Common.WINDOW_SIZE.width,
      height: Common.WINDOW_SIZE.height,
      resizable: true,
      show: false,
      frame: false,
      icon,
      webPreferences: {
        preload: join(__dirname, '../../inject/preload.js')
      }
    })
  }

  loadURL() {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/windows/index.html`)
    } else {
      this.mainWindow.loadFile(join(__dirname, '../../renderer/windows/index.html'))
    }
  }

  show() {
    this.mainWindow.show()
    this.mainWindow.focus()
    this.mainWindow.webContents.send('show-main-window')
  }
  minimize() {
    if (!this.mainWindow.isMinimized()) {
      this.mainWindow.minimize()
    }
  }
  hide() {
    this.mainWindow.hide()
    this.mainWindow.webContents.send('hide-main-window')
  }

  close() {
    this.mainWindow.close()
  }

  initWindowWebContent() {
    if (Common.DEBUG_MODE) {
      this.mainWindow.webContents.openDevTools()
    }
    this.loadURL()
  }

  initWindowEvents() {
    this.mainWindow.on('close', () => {
      this.unregisterLocalShortCut()
    })

    this.mainWindow.on('ready-to-show', () => {
      this.registerLocalShortcut()
      this.mainWindow.show()
    })
  }

  //注册快捷键
  registerLocalShortcut() {
    console.log('注册快捷键')
    // register(this.mainWindow, 'CommandOrControl + H', () => {
    //   this.mainWindow.hide()
    // })
  }

  unregisterLocalShortCut() {
    unregisterAll(this.mainWindow)
  }
  
  isShown() {
    return this.mainWindow.isVisible()
  }
}

module.exports = mainWindow
