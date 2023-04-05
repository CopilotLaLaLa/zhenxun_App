import './assets/css/styles.less'
let cancelBtn = document.getElementById('cancel')
let okBtn = document.getElementById('ok')
let minSysBtn = document.getElementById('minSys')

cancelBtn.addEventListener('click', () => {
  window.api.cancleCloseTipWindow()
})

okBtn.addEventListener('click', () => {
  window.api.closeTipWindow()
})

minSysBtn.addEventListener('click', () => {
  window.api.minTipWindow()
})
