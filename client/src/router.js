import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Registration from './views/Registration.vue'
// import Decks from './views/Decks.vue'
import Login from './views/Login.vue'
import Achievements from './views/Achievements.vue'
import Main from './views/Main.vue'
import Profile from './views/Profile.vue'
import AdminPanel from './views/AdminPanel.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/registration', name: 'registration', component: Registration },
  { path: '/login', name: 'login', component: Login },
  { path: '/achievements', name: 'achievements', component: Achievements },
  { path: '/main', name: 'main', component: Main },
  { path: '/profile', name: 'profile', component: Profile },
  // { path: '/decks', name: 'decks', component: Decks },
  { path: '/admin-panel', name: 'admin panel', component: AdminPanel }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
