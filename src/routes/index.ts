import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    beforeEnter: () => {
      useGame().reset()
      useConnection().reset()
    },
    component: () => import('../views/Start.vue'),
    meta: {
      transition: 'fade',
    },
    name: 'Start Game',
    path: '/',
  },
  {
    beforeEnter: () => {
      useGame().reset()
      useConnection().reset()
    },
    component: () => import('../views/Host.vue'),
    meta: {
      transition: 'fade',
    },
    name: 'Host',
    path: '/host',
  },
  {
    beforeEnter: () => {
      useGame().reset()
      useConnection().reset()
    },
    component: () => import('../views/Join.vue'),
    meta: {
      transition: 'fade',
    },
    name: 'Join',
    path: '/join',
  },
  {
    beforeEnter: () => {
      const { gameState } = useGame()
      gameState.value = 'setup'
      return gameState.value === 'setup'
    },
    component: () => import('../views/Setup.vue'),
    meta: {
      requiresConnection: true,
      transition: 'fade',
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
    component: () => import('../views/CoinFlip.vue'),
    name: 'Who Starts?',
    path: '/start',
  },
  {
    beforeEnter: () => {
      const { gameState, playersTurn } = useGame()
      gameState.value = 'active'
      if (!playersTurn.value) {
        console.warn('Redirecting to opponent\'s turn')
        // Redirect to the opponent's turn if it's not the player's turn
        return { name: 'Opponent\'s Turn' }
      }
      return playersTurn.value
    },
    component: () => import('../views/PlayerTurn.vue'),
    meta: {
      requiresConnection: true,
      transition: 'slide-left',
    },
    name: 'Player\'s Turn',
    path: '/players-turn',
  },
  {
    beforeEnter: () => {
      const { gameState, playersTurn } = useGame()
      gameState.value = 'active'
      if (playersTurn.value) {
        // Redirect to the player's turn if it's the player's turn
        console.warn('Redirecting to player\'s turn')
        return { name: 'Player\'s Turn' }
      }
      return !playersTurn.value
    },
    component: () => import('../views/OpponentTurn.vue'),
    meta: {
      requiresConnection: true,
      transition: 'slide-right',
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
