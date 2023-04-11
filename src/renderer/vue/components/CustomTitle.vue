<script setup>
const minWin = () => {
  window.mainWindow.minimizeWindow()
}
const cloWin = () => {
  window.mainWindow.closeWindow()
}
</script>

<template>
  <div class="top-bar">
    <div class="title"></div>
    <div class="win-button">
      <div class="btn min" @click="minWin()">
        <el-icon :size="20" color="#ffffff"><Minus /></el-icon>
      </div>
      <div class="btn clo" @click="cloWin()">
        <el-icon :size="20" color="#ffffff"><Close /></el-icon>
      </div>
    </div>
  </div>
</template>

<style scoped>
.top-bar {
  position: fixed;
  top: 0;
  width: 100%;
  height: 30px;
  background: transparent;
  display: flex;
  justify-content: space-between;
  z-index: 999;
}
.title {
  width: 100%;
  -webkit-app-region: drag;
}
.win-button {
  display: flex;
  height: 100%;
}
.btn {
  display: flex;
  height: 30px;
  width: 50px;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease-in-out;
}
.min:hover {
  background-color: #ffffff47;
  cursor: pointer;
}
.clo:hover {
  background-color: red;
  cursor: pointer;
}
</style>
