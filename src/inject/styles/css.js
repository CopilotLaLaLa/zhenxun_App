'use strict'
const Common = require('../config/common_cn')

class CSSInjector {}

CSSInjector.commonCSS = `
    html, body {
       background-color: red;
    }
    button {
      background:  ${Common.BUTTON_COLOR}
    }

    div#userSelectionBox {
      box-shadow: 1px 1px 10px #ababab;
      background: #fff;
      display: none;
      position: fixed;
      bottom: ${Common.MENTION_MENU_INITIAL_Y}px;
      left: ${Common.MENTION_MENU_INITIAL_X}px;
    }
  `

module.exports = CSSInjector
