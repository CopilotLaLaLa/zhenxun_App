'use strict'

const path = require('path')
const { shell, BrowserWindow } = require('electron')
import { is } from '@electron-toolkit/utils'
const electronLocalShortcut = require('electron-localshortcut')

const AppConfig = require('../../main/configuration')

const CSSInjector = require('../../inject/css')
const MessageHandler = require('../../handlers/message')

const lan = AppConfig.readSettings('language')

import icon from '../../resources/icon.jpg?asset'

let Common
if (lan === 'zh-CN') {
  Common = require('../../main/common_cn')
} else {
  Common = require('../../main/common')
}

class mainWindow {
  constructor() {
    this.isShown = false
    // this.loginState = { NULL: -2, WAITING: -1, YES: 1, NO: 0 }
    // this.loginState.current = this.loginState.NULL
    // this.inervals = {}
    this.createWindow()
    this.initmainWindowShortcut()
    this.initWindowEvents()
    this.initWindowWebContent()
  }
  //重绘窗口
  resizeWindow() {}

  createWindow() {
    this.mainWindow = new BrowserWindow({
      title: Common.TITLE,
      resizable: true,
      center: true,
      show: false,
      frame: false,
      icon,
      webPreferences: {
        preload: path.join(__dirname, '../../inject/preload.js'),
        nodeIntegration: false,
        contextIsolation: true
      }
    })
  }

  loadURL() {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    } else {
      this.mainWindow.loadFile(path.join(__dirname, '../views/index.html'))
    }
  }

  show() {
    this.mainWindow.show()
    this.mainWindow.focus()
    this.mainWindow.webContents.send('show-main-window')
    this.isShown = true
  }

  hide() {
    this.mainWindow.hide()
    this.mainWindow.webContents.send('hide-main-window')
    this.isShown = false
  }

  initWindowWebContent() {
    if (Common.DEBUG_MODE) {
      this.mainWindow.webContents.openDevTools()
    }

    this.loadURL(Common.MAIN_URL)

    this.mainWindow.webContents.on('dom-ready', () => {
      this.mainWindow.webContents.insertCSS(CSSInjector.commonCSS)
    })

    this.mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault()
      shell.openExternal(new MessageHandler().handleRedirectMessage(url))
    })
  }

  initWindowEvents() {
    this.mainWindow.on('close', (e) => {
      if (this.mainWindow.isVisible()) {
        e.preventDefault()
        this.hide()
      }
      this.unregisterLocalShortCut()
    })

    this.mainWindow.on('show', () => {
      this.registerLocalShortcut()
    })
  }

  //注册快捷键
  registerLocalShortcut() {
    electronLocalShortcut.register(this.mainWindow, 'CommandOrControl + H', () => {
      this.mainWindow.hide()
    })
  }

  unregisterLocalShortCut() {
    electronLocalShortcut.unregisterAll(this.mainWindow)
  }

  initmainWindowShortcut() {
    this.registerLocalShortcut()
  }
}

module.exports = mainWindow
