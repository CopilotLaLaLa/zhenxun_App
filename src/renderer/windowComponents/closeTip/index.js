
let cancelBtn = document.getElementById('cancel')
let okBtn = document.getElementById('ok')

cancelBtn.addEventListener('click', () => {
  window.api.cancleCloseTipWindow()
})

okBtn.addEventListener('click', () => {
  window.api.closeTipWindow()
})
