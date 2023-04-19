'use strict'

function getUserHome() {
  return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
}


const nconf = require('nconf').file({
  file: `${getUserHome()}/.ew.json`
})

export function saveSettings(settingKey, settingValue) {
  nconf.set(settingKey, settingValue)
  nconf.save()
}

export function readSettings(settingKey) {
  nconf.load()
  return nconf.get(settingKey)
}
