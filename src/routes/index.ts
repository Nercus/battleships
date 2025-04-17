import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Start Game',
    component: () => import('../views/Start.vue'),
    beforeEnter: () => {
      useGameStore().$reset()
      useConnectionStore().$reset()
    },
  },
  {
    path: '/host',
    name: 'Host',
    component: () => import('../views/Host.vue'),
    beforeEnter: () => {
      useGameStore().$reset()
      useConnectionStore().$reset()
    },
  },
  {
    path: '/join',
    name: 'Join',
    component: () => import('../views/Join.vue'),
    beforeEnter: () => {
      useGameStore().$reset()
      useConnectionStore().$reset()
    },
  },
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('../views/Setup.vue'),
    beforeEnter: () => {
      const { gameState } = storeToRefs(useGameStore())
      gameState.value = 'setup'
      return gameState.value === 'setup'
    },
    meta: {
      requiresConnection: true,
    },
  },
  {
    path: '/start',
    name: 'Who Starts?',
    component: () => import('../views/CoinFlip.vue'),
    beforeEnter: () => {
      const { gameState } = storeToRefs(useGameStore())
      gameState.value = 'coin-flip'
      return gameState.value === 'coin-flip'
    },
  },
  {
    path: '/players-turn',
    name: 'Player\'s Turn',
    component: () => import('../views/PlayerTurn.vue'),
    beforeEnter: () => {
      const { myTurn, gameState } = storeToRefs(useGameStore())
      gameState.value = 'active'
      if (!myTurn.value) {
        console.warn('Redirecting to opponent\'s turn')
        // Redirect to the opponent's turn if it's not the player's turn
        return { name: 'Opponent\'s Turn' }
      }
      return myTurn.value
    },
    meta: {
      requiresConnection: true,
    },
  },
  {
    path: '/opponents-turn',
    name: 'Opponent\'s Turn',
    component: () => import('../views/OpponentTurn.vue'),
    beforeEnter: () => {
      const { myTurn, gameState } = storeToRefs(useGameStore())
      gameState.value = 'active'
      if (myTurn.value) {
        // Redirect to the player's turn if it's the player's turn
        console.warn('Redirecting to player\'s turn')
        return { name: 'Player\'s Turn' }
      }
      return !myTurn.value
    },
    meta: {
      requiresConnection: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export type Routes = typeof routes[number]['path']
export default router
