<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <div class="flex flex-col justify-center items-center p-2 size-full">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" class="overflow-hidden" />
      </transition>
    </RouterView>
  </div>
  <Toolbar />
  <GameEndPopup />
</template>

<script setup lang="ts">
import { Notification, Notivue } from 'notivue'
import { RouterView } from 'vue-router'

const { connected } = useConnection()

window.addEventListener('beforeunload', (event) => {
  if (import.meta.env.MODE === 'development') return
  if (!connected.value) return
  // Custom message may not display in modern browsers, but this will trigger a confirmation dialog
  event.preventDefault()
})

function showWarning() {
  push.warning({
    duration: 5000,
    message: 'Refreshing the page will end the connection. Please use the browser\'s reload button instead, if you insist on refreshing.',
    title: 'Warning',
  })
}

const showWarningDebounced = useDebounceFn(showWarning, 200, {
  maxWait: 500,
})

document.addEventListener('keydown', (event) => {
  if (import.meta.env.MODE === 'development') return
  if (!connected.value) return
  if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
    event.preventDefault()
    showWarningDebounced()
  }
  if (event.key === 'F5') {
    event.preventDefault()
    showWarningDebounced()
  }
})
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
