'use strict'
const { ipcRenderer, contextBridge } = require('electron')
class Injector {
  init() {
    this.initIPC()
    this.initAPI()
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
        contextBridge.exposeInMainWorld('mainWindow', {
          closeWindow: () => ipcRenderer.send('close-main-window'),
          minimizeWindow: () => ipcRenderer.send('minimize-main-window'),
          hideWindow: () => ipcRenderer.send('hide-main-window')
        })
        contextBridge.exposeInMainWorld('dialogWindow', {
          cancelClick: () => ipcRenderer.send('cancel-dialog-window'),
          okClick: (message) => ipcRenderer.send('ok-dialog-window', message)
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
