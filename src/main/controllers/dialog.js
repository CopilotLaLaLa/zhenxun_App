'use strict'

const { join } = require('path')
const { BrowserWindow } = require('electron')
import { is } from '@electron-toolkit/utils'

const CSSInjector = require('../../inject/styles/css')
const AppConfig = require('../configuration')

const lan = AppConfig.readSettings('language')

import icon from '../../../resources/icon.png?asset'

let Common
if (lan === 'zh-CN') {
  Common = require('../../inject/config/common_cn')
} else {
  Common = require('../../inject/config/common')
}

class DialogWindow {
  constructor(fatherWindow, tray) {
    this.tray = tray
    this.dialogWindow = new BrowserWindow({
      parent: fatherWindow,
      width: Common.WINDOW_SIZE_DIALOG.width,
      height: Common.WINDOW_SIZE_DIALOG.height,
      title: Common.TITLE,
      resizable: false,
      show: false,
      frame: false,
      modal: true,
      skipTaskbar: true,
      icon,
      webPreferences: {
        preload: join(__dirname, '../../inject/preload.js')
      }
    })

    this.initWindowWebContent()
    this.initWindowEvents()
  }

  loadURL() {
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.dialogWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/windows/tips.html`)
    } else {
      this.dialogWindow.loadFile(join(__dirname, '../../renderer/windows/tips.html'))
    }
  }

  initWindowWebContent() {
    this.loadURL()
    this.dialogWindow.webContents.on('dom-ready', () => {
      this.dialogWindow.webContents.insertCSS(CSSInjector.commonCSS)
    })
    this.dialogWindow.webContents.on('did-finish-load', () => {
      this.dialogWindow.webContents.insertCSS(CSSInjector.commonCSS)
      // this.dialogWindow.webContents.insertCSS('html, body { background-color: red; }')
    })
  }

  initWindowEvents() {
    this.dialogWindow.on('close', () => {
      this.tray.initTrayEvents()
    })

    this.dialogWindow.on('ready-to-show', () => {
      this.tray.trayEventsRemove()
      this.dialogWindow.show()
    })

    this.dialogWindow.on('show', () => {})
  }

  close() {
    this.dialogWindow.close()
  }
}

module.exports = DialogWindow
