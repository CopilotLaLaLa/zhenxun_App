import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MyApi from '../views/MyApi.vue'
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/api',
    name: 'MyApi',
    component: MyApi
  }
]
const router = createRouter({
  routes,
  history: createWebHashHistory()
})
export default router
