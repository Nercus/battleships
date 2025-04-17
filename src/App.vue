<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <div class="w-dvw h-dvh bg-base-100 overflow-hidden flex flex-col items-center justify-center">
    <RouterView />
  </div>
  <Toolbar />
</template>

<script setup lang="ts">
import { Notification, Notivue } from 'notivue'
import { RouterView } from 'vue-router'

const { connected } = storeToRefs(useConnectionStore())

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
