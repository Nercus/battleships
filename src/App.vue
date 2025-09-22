<template>
  <Notivue v-slot="item">
    <Notification :item="item" :theme="theme" :icons="outlinedIcons">
      <NotificationProgress :item="item" />
    </Notification>
  </Notivue>
  <div class="flex flex-col justify-center items-center size-full">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" class="overflow-hidden" />
      </Transition>
    </RouterView>
  </div>
  <Toolbar />
  <GameEndPopup />
</template>

<script setup lang="ts">
import { lightTheme, Notification, NotificationProgress, Notivue, outlinedIcons } from 'notivue'
import { RouterView } from 'vue-router'

const { isConnected } = useConnection()

window.addEventListener('beforeunload', (event) => {
  if (import.meta.env.MODE === 'development') return
  if (!isConnected.value) return
  // Custom message may not display in modern browsers, but this will trigger a confirmation dialog
  event.preventDefault()
})

function showWarning() {
  push.warning({
    duration: 5000,
    message: 'Refreshing the page will end the connection. Please use the browser\'s reload button instead, if you insist on refreshing.',
  })
}

const showWarningDebounced = useDebounceFn(showWarning, 200, {
  maxWait: 500,
})

document.addEventListener('keydown', (event) => {
  if (import.meta.env.MODE === 'development') return
  if (!isConnected.value) return
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault()
    showWarningDebounced()
  }
  if (event.key === 'F5') {
    event.preventDefault()
    showWarningDebounced()
  }
})

const theme = {
  ...lightTheme,
  '--nv-success-accent': '#7ac270',
  '--nv-error-accent': '#d04e4e',
  '--nv-warning-accent': '#d0ba49',
  '--nv-info-accent': '#8baee9',
  '--nv-promise-accent': '#8baee9',
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s cubic-bezier(0.65, 0, 0.35, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
@media (max-width: 768px) {
  :root {
    --nv-root-x-align: center;
  }
}
</style>
