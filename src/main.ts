import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'

// Import pages
import HomePage from './pages/HomePage.vue'
import CommunityPage from './pages/CommunityPage.vue'
import MallPage from './pages/MallPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import CirclesPage from './pages/CirclesPage.vue'
import CircleDetailPage from './pages/CircleDetailPage.vue'
import UserProfilePage from './pages/UserProfilePage.vue'
import SearchPage from './pages/SearchPage.vue'
import NotificationPage from './pages/NotificationPage.vue'
import LoginPage from './pages/LoginPage.vue'
import PublishPage from './pages/PublishPage.vue'
import CreateActivityPage from './pages/CreateActivityPage.vue'
import ActivityZonePage from './pages/ActivityZonePage.vue'
import RechargePage from './pages/RechargePage.vue'

const routes = [
  { path: '/', name: 'home', component: HomePage },
  { path: '/community', name: 'community', component: CommunityPage },
  { path: '/mall', name: 'mall', component: MallPage },
  { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/circles', name: 'circles', component: CirclesPage },
  { path: '/circle/:id', name: 'circle-detail', component: CircleDetailPage, props: true },
  { path: '/user/:id', name: 'user-profile', component: UserProfilePage, props: true },
  { path: '/search', name: 'search', component: SearchPage },
  { path: '/notifications', name: 'notifications', component: NotificationPage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/publish', name: 'publish', component: PublishPage },
  { path: '/create-activity', name: 'create-activity', component: CreateActivityPage },
  { path: '/activity-zone', name: 'activity-zone', component: ActivityZonePage },
  { path: '/recharge', name: 'recharge', component: RechargePage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')