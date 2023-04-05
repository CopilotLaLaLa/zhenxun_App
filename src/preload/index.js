import { contextBridge, ipcRenderer } from 'electron'
// import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  cancleCloseTipWindow: () => ipcRenderer.send('cancleCloseTipWindow'),
  closeTipWindow: () => ipcRenderer.send('closeTipWindow'),
  minTipWindow: () => ipcRenderer.send('minTipWindow')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('myAPI', {
      closeWindow: () => ipcRenderer.send('closeWindow'),
      minimizeWindow: () => ipcRenderer.send('minimizeWindow')
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // window.electron = electronAPI
  window.api = api
}
