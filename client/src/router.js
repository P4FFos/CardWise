import { createRouter, createWebHistory } from 'vue-router'
import StartPage from './views/StartPage.vue'
import Registration from './views/Registration.vue'
import Login from './views/Login.vue'
import Achievements from './views/Achievements.vue'
import Main from './views/Main.vue'
import Profile from './views/Profile.vue'
import AdminPanel from './views/AdminPanel.vue'
import Deck from './views/Deck.vue'
import Practice from './views/Practice.vue'

const routes = [
  { path: '/', name: 'start-page', component: StartPage },
  { path: '/registration', name: 'registration', component: Registration },
  { path: '/login', name: 'login', component: Login },
  { path: '/achievements', name: 'achievements', component: Achievements },
  { path: '/main', name: 'main', component: Main },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/admin-panel', name: 'admin panel', component: AdminPanel },
  { path: '/deck/:deckId', name: 'deck', component: Deck, props: true },
  { path: '/deck/:deckId/practice', name: 'practice', component: Practice, props: true },
  { path: '/profile', name: 'profile', component: Profile }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
