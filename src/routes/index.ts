import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'

const { myTurn } = useGame()

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
    path: '/start',
    name: 'Who Starts?',
    component: () => import('../views/CoinFlip.vue'),
  },
  {
    path: '/players-turn',
    name: 'Player\'s Turn',
    component: () => import('../views/PlayerTurn.vue'),
    beforeEnter: () => {
      if (!myTurn.value) {
        // Redirect to the opponent's turn if it's not the player's turn
        return { name: 'Opponent\'s Turn' }
      }
      return myTurn.value
    },
  },
  {
    path: '/opponents-turn',
    name: 'Opponent\'s Turn',
    component: () => import('../views/OpponentTurn.vue'),
    beforeEnter: () => {
      if (myTurn.value) {
        // Redirect to the player's turn if it's the player's turn
        return { name: 'Player\'s Turn' }
      }
      return !myTurn.value
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export type Routes = typeof routes[number]['path']
export default router
