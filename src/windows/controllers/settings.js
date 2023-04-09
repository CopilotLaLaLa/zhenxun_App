'use strict'

const path = require('path')
const { BrowserWindow } = require('electron')
const electronLocalShortcut = require('electron-localshortcut')

const AppConfig = require('../../main/configuration')

const lan = AppConfig.readSettings('language')

import icon from '../../resources/icon.jpg?asset'

let Common
if (lan === 'zh-CN') {
  Common = require('../../main/common_cn')
} else {
  Common = require('../../main/common')
}

class SettingsWindow {
  constructor() {
    this.settingsWindow = null
    this.createSettingsWindow()
  }

  createSettingsWindow() {
    this.settingsWindow = new BrowserWindow({
      width: Common.WINDOW_SIZE_SETTINGS.width,
      height: Common.WINDOW_SIZE_SETTINGS.height * 0.9,
      resizable: false,
      fullscreenable: false,
      show: false,
      frame: false,
      alwaysOnTop: true,
      icon
    })

    this.initWindowEvents()
    this.initSettingsWindowShortcut()

    this.settingsWindow.loadURL(`file://${path.join(__dirname, '/../views/settings.html')}`)
  }

  initWindowEvents() {
    this.settingsWindow.on('close', () => {
      this.unregisterLocalShortCut()
      this.settingsWindow = null
      this.isShown = false
    })
    this.settingsWindow.once('ready-to-show', () => {
      this.settingsWindow.show()
    })
  }

  show() {
    if (!this.settingsWindow) {
      this.createSettingsWindow()
    }
    this.settingsWindow.show()
    this.isShown = true
  }

  hide() {
    this.settingsWindow.hide()
    this.isShown = false
  }

  registerLocalShortcut() {
    electronLocalShortcut.register(this.settingsWindow, 'Esc', () => {
      this.settingsWindow.close()
    })
  }

  unregisterLocalShortCut() {
    electronLocalShortcut.unregisterAll(this.settingsWindow)
  }

  initSettingsWindowShortcut() {
    this.registerLocalShortcut()
  }
}

module.exports = SettingsWindow
