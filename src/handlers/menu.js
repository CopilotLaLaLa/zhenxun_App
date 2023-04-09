'use strict'

const { remote } = require('electron')
const AppConfig = require('../main/configuration')

const { Menu } = remote

const lan = AppConfig.readSettings('language')
let Common
if (lan === 'zh-CN') {
  Common = require('../main/common_cn')
} else {
  Common = require('../main/common')
}

class MenuHandler {
  create() {
    const template = this.getTemplate(remote.process.platform)
    if (template) {
      const menuFromTemplate = Menu.buildFromTemplate(template)
      Menu.setApplicationMenu(menuFromTemplate)
    }
  }

  getTemplate(platform) {
    if (platform === 'win32') {
      return Common
    } else {
      return Common
    }
  }
}
module.exports = MenuHandler
