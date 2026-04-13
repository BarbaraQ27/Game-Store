import { createRouter, createWebHistory } from 'vue-router'
import MainView from '@/views/MainView.vue'
import GameDetail from '@/components/GameDetail.vue'
import DashboardView from '@/views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    children: [
      {
        path: '',         // sin / inicial → relativo al padre
        name: 'Home',
        component: () => import('@/views/DashboardHome.vue'),
      },
      {
        path: 'store',
        name: 'Store',
        component: () => import('@/views/GameListView.vue'),
      },
      {
        path: 'wishlist',
        name: 'Wishlist',
        component: () => import('@/views/WishlistView.vue'),
      },
      {
        path: 'mygames',
        name: 'MyGames',
        component: () => import('@/views/MyGamesView.vue'),
      },
      {
        path: '/game/:slug', // ruta con el nombre simplificado de los juegos en API
        name: 'GameDetail',
        component: GameDetail,
        props: true,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
