import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Registration from './views/Registration.vue'
import Decks from './views/Decks.vue'
import Login from './views/Login.vue'
import Main from './views/Main.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/registration', name: 'registration', component: Registration },
  { path: '/main', name: 'main', component: Main },
  { path: '/decks', name: 'decks', component: Decks },
  { path: '/login', name: 'login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
