import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Start Game',
    component: () => import('../views/Start.vue'),
  },
  {
    path: '/host',
    name: 'Host',
    component: () => import('../views/Host.vue'),
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('../views/Join.vue'),
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/Setup.vue'),
  },
  {
    path: '/players-turn',
    name: 'Player\'s Turn',
    component: () => import('../views/PlayerTurn.vue'),
  },
  {
    path: '/opponents-turn',
    name: 'Opponent\'s Turn',
    component: () => import('../views/OpponentTurn.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export type Routes = typeof routes[number]['path']
export default router
