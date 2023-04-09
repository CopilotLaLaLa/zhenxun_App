'use strict'

const { ipcRenderer, contextBridge, webFrame } = require('electron')
const MenuHandler = require('../handlers/menu')
const Common = require('../main/common')

class Injector {
  init() {
    if (Common.DEBUG_MODE) {
      Injector.lock(window, 'console', window.console)
    }
    // eslint-disable-next-line prettier/prettier
    this.initInjectBundle();
    this.initAngularInjection()
    this.lastUser = null
    this.initIPC()
    webFrame.setZoomLevelLimits(1, 1)

    new MenuHandler().create()
  }

  initInjectBundle() {
    MenuHandler.create()
  }

  initIPC() {
    //
    ipcRenderer.on('hide-main-window', () => {})
    //
    ipcRenderer.on('show-main-window', () => {})
  }

  initAPI() {
    const api = {
      cancleCloseTipWindow: () => ipcRenderer.send('cancleCloseTipWindow'),
      closeTipWindow: () => ipcRenderer.send('closeTipWindow'),
      minTipWindow: () => ipcRenderer.send('minTipWindow')
    }

    if (process.contextIsolated) {
      try {
        contextBridge.exposeInMainWorld('api', api)
        contextBridge.exposeInMainWorld('myAPI', {
          closeWindow: () => ipcRenderer.send('close-main-window'),
          minimizeWindow: () => ipcRenderer.send('minimizeWindow')
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      window.api = api
    }
  }
}

new Injector().init()
