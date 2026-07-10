import type { RouteMap } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

for (const route of routes) {
  switch (route.name) {
    case 'Home':
      route.beforeEnter = () => {
        useGame().reset()
        useConnection().reset()
      }
      break
    case 'Setup':
      route.beforeEnter = createGameStateGuard('setup')
      break
    case 'Coinflip':
      route.beforeEnter = createGameStateGuard('coin-flip')
      break
    case 'Play':
      route.beforeEnter = createGameStateGuard('active')
      break
    case 'End':
      route.beforeEnter = createGameStateGuard('ended')
      break
  }
}

function createGameStateGuard(state: 'setup' | 'coin-flip' | 'active' | 'ended') {
  return () => {
    const { gameState } = useGame()
    gameState.value = state
    return gameState.value === state
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export type Routes = RouteMap[keyof RouteMap]['path']
export default router
