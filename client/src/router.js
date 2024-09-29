import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Registration from './views/Registration.vue'
import Login from './views/Login.vue'
import Achievements from './views/Achievements.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/registration', name: 'registration', component: Registration },
  { path: '/login', name: 'login', component: Login },
  { path: '/login', name: 'login', component: Login },
  { path: '/achievements', name: 'achievements', component: Achievements}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
