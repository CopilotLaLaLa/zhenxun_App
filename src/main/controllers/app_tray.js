'use strict'
const { Menu, Tray } = require('electron')
import { readSettings } from '../configuration'

const lan = readSettings('language')

import icon from '../../../resources/icon.jpg?asset'

let Common
if (lan === 'zh-CN') {
  Common = require('../../inject/config/common_cn')
} else {
  Common = require('../../inject/config/common')
}

class AppTray {
  constructor(mainWindow) {
    this.mainWindow = mainWindow
    this.showMainWindowCRM = this.showMainWindow.bind(this)
    this.createTray()
    this.initTrayEvents()
  }

  createTray() {
    this.tray = new Tray(icon)
    this.contextMenu = Menu.buildFromTemplate([
      {
        label: Common.TRAY_MENU.show,
        click: () => {
          this.mainWindow.show()
        }
      },
      {
        label: Common.TRAY_MENU.hide,
        click: () => {
          this.mainWindow.hide()
        }
      },
      {
        label: Common.TRAY_MENU.exit,
        click: () => {
          this.mainWindow.close()
        }
      }
    ])
    this.tray.setToolTip('真寻的小房间')
  }
  showMainWindow() {
    this.mainWindow.isShown() ? this.mainWindow.hide() : this.mainWindow.show()
  }
  initTrayEvents() {
    this.tray.addListener('click', this.showMainWindowCRM)
    this.tray.setContextMenu(this.contextMenu)
  }
  //在弹出对话框的情况下禁用托盘菜单功能
  trayEventsRemove() {
    this.tray.removeListener('click', this.showMainWindowCRM)
    this.tray.setContextMenu(null)
  }
}

module.exports = AppTray
