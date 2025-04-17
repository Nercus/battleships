import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    beforeEnter: () => {
      useGameStore().$reset()
      useConnectionStore().$reset()
    },
    component: () => import('../views/Start.vue'),
    name: 'Start Game',
    path: '/',
  },
  {
    beforeEnter: () => {
      useGameStore().$reset()
      useConnectionStore().$reset()
    },
    component: () => import('../views/Host.vue'),
    name: 'Host',
    path: '/host',
  },
  {
    beforeEnter: () => {
      useGameStore().$reset()
      useConnectionStore().$reset()
    },
    component: () => import('../views/Join.vue'),
    name: 'Join',
    path: '/join',
  },
  {
    beforeEnter: () => {
      const { gameState } = storeToRefs(useGameStore())
      gameState.value = 'setup'
      return gameState.value === 'setup'
    },
    component: () => import('../views/Setup.vue'),
    meta: {
      requiresConnection: true,
    },
    name: 'Setup',
    path: '/setup',
  },
  {
    beforeEnter: () => {
      const { gameState } = storeToRefs(useGameStore())
      gameState.value = 'coin-flip'
      return gameState.value === 'coin-flip'
    },
    component: () => import('../views/CoinFlip.vue'),
    name: 'Who Starts?',
    path: '/start',
  },
  {
    beforeEnter: () => {
      const { gameState, myTurn } = storeToRefs(useGameStore())
      gameState.value = 'active'
      if (!myTurn.value) {
        console.warn('Redirecting to opponent\'s turn')
        // Redirect to the opponent's turn if it's not the player's turn
        return { name: 'Opponent\'s Turn' }
      }
      return myTurn.value
    },
    component: () => import('../views/PlayerTurn.vue'),
    meta: {
      requiresConnection: true,
    },
    name: 'Player\'s Turn',
    path: '/players-turn',
  },
  {
    beforeEnter: () => {
      const { gameState, myTurn } = storeToRefs(useGameStore())
      gameState.value = 'active'
      if (myTurn.value) {
        // Redirect to the player's turn if it's the player's turn
        console.warn('Redirecting to player\'s turn')
        return { name: 'Player\'s Turn' }
      }
      return !myTurn.value
    },
    component: () => import('../views/OpponentTurn.vue'),
    meta: {
      requiresConnection: true,
    },
    name: 'Opponent\'s Turn',
    path: '/opponents-turn',
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export type Routes = typeof routes[number]['path']
export default router
