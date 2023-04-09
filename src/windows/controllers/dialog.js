'use strict'

const path = require('path')
const { BrowserWindow } = require('electron')

const AppConfig = require('../../main/configuration')

const lan = AppConfig.readSettings('language')

import icon from '../../resources/icon.jpg?asset'

let Common
if (lan === 'zh-CN') {
  Common = require('../../main/common_cn')
} else {
  Common = require('../../main/common')
}

class DialogWindow {
  constructor() {
    this.dialogWindow = new BrowserWindow({
      width: Common.WINDOW_SIZE_LOADING.width,
      height: Common.WINDOW_SIZE_LOADING.height,
      title: Common.ELECTRONIC_WECHAT,
      resizable: false,
      center: true,
      show: true,
      frame: false,
      alwaysOnTop: true,
      icon
    })

    this.dialogWindow.loadURL(`file://${path.join(__dirname, '/../views/splash.html')}`)
    this.isShown = false
  }

  show() {
    this.dialogWindow.show()
    this.isShown = true
  }

  hide() {
    this.dialogWindow.hide()
    this.isShown = false
  }
}

module.exports = DialogWindow
