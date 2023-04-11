<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
let loginForm = reactive({
  username: '',
  password: ''
})
let loading = ref(false)
const changeApi = () => {
  router.push('/api')
}
</script>

<template>
  <div class="border">
    <div class="left-form">
      <div class="head-box">
        <div class="head-border">
          <img class="head-pic" src="../assets/image/head_pic.jpg" alt="用户头像" />
        </div>
        <div class="title-border">
          <p class="title">欢迎来到<span class="title-text">真寻的小房间</span></p>
          <p class="title-des">真尋の小部屋へようこそ、お兄さん</p>
        </div>
      </div>

      <el-form
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :model="loginForm"
        class="loginContainer"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            class="input-border"
            prefix-icon="UserFilled"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            class="input-border"
            prefix-icon="Lock"
          >
          </el-input>
          <!-- 关闭输入密码在打开时默认获取焦点 -->
        </el-form-item>
        <div style="display: flex">
          <el-button
            type="primary"
            style="width: 50%; border-radius: 12px"
            native-type="submit"
            plain
            @click="changeApi()"
            >更换API</el-button
          >
          <el-button type="primary" style="width: 50%; border-radius: 12px" native-type="submit"
            >登录</el-button
          >
        </div>
      </el-form>
      <div class="forget-pwd">
        <el-button type="text">忘记密码</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forget-pwd {
  float: right;
  margin-left: 10px;
}
.icon {
  margin-left: 10px;
  color: #aa9ea5;
}
.el-form {
  width: 400px;
}
.el-input--prefix .el-input__inner {
  padding-left: 40px;
  border: 1px solid #e9dfe5;
  border-radius: 12px;
}
.input-border {
  height: 46px;
}
.border {
  background: url('../assets/image/login_bk4.png');
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  display: flex;
  /* 水平垂直居中 */
  justify-content: center;
  align-items: center;
}
.bk-img-border {
  height: 100%;
  width: 100%;
  z-index: -1;
}

.bk-img {
  width: 100%;
}

.head-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  user-select: none;
}
.head-border {
  width: 80px;
  height: 80px;
  border: #909090 1px solid;
  background: #fff;
  color: #333;
  -moz-box-shadow: 2px 2px 10px #909090;
  -webkit-box-shadow: 2px 2px 10px #909090;
  box-shadow: 2px 2px 10px #909090;
  border-radius: 50%;
  text-align: center;
}
.head-pic {
  border-radius: 50%;
  background-color: #9facb7;
  width: 70px;
  height: 70px;
  margin-top: 5px;
}

.title-border {
  margin: 0 auto;
}

.title {
  font-size: 23px;
  color: black;
}

.title-text {
  font-weight: bold;
  margin-left: 10px;
}

.title-des {
  color: #9facb7;
  font-size: 13px;
  margin-top: 10px;
}

.left-form {
  background-color: rgba(255, 255, 255, 0.85);
  padding: 30px 50px 20px 50px;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
}
.el-form-item__label {
  font-weight: bold;
}
</style>
