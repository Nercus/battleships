import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    beforeEnter: () => {
      useGame().reset()
      useConnection().reset()
    },
    component: () => import('../pages/Home.vue'),
    name: 'Home',
    path: '/',
  },
  {
    beforeEnter: () => {
      const { gameState } = useGame()
      gameState.value = 'setup'
      return gameState.value === 'setup'
    },
    component: () => import('../pages/Setup.vue'),
    meta: {
      requiresConnection: true,
    },
    name: 'Setup',
    path: '/setup',
  },
  {
    beforeEnter: () => {
      const { gameState } = useGame()
      gameState.value = 'coin-flip'
      return gameState.value === 'coin-flip'
    },
    component: () => import('../pages/Coinflip.vue'),
    meta: {
      requiresConnection: true,
    },
    name: 'Who Starts?',
    path: '/start',
  },
  {
    beforeEnter: () => {
      const { gameState } = useGame()
      gameState.value = 'active'
      return gameState.value === 'active'
    },
    component: () => import('../pages/Play.vue'),
    meta: {
      requiresConnection: true,
    },
    name: 'Playing',
    path: '/play',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export type Routes = typeof routes[number]['path']
export default router
