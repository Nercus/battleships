import type { RouteRecordRaw } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Start Game',
    component: () => import('../views/StartGame.vue'),
  },
  {
    path: '/host-connect',
    name: 'Host-Connect',
    component: () => import('../views/HostConnect.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export type Routes = typeof routes[number]['path']
export default router
