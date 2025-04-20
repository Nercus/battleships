<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <div class="size-full flex flex-col items-center justify-center">
    <RouterView v-slot="{ Component, route }">
      <transition :name="(route.meta.transition as string) || 'fade'" mode="out-in">
        <component :is="Component" class="overflow-hidden" />
      </transition>
    </RouterView>
  </div>
  <Toolbar />
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
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.5s ease-out;
}

.slide-right-enter-to {
  position: absolute;
  right: 0;
}

.slide-right-enter-from {
  position: absolute;
  right: -100%;
}

.slide-right-leave-to {
  position: absolute;
  left: -100%;
}

.slide-right-leave-from {
  position: absolute;
  left: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.5s ease-out;
}

.slide-left-enter-to {
  position: absolute;
  left: 0;
}

.slide-left-enter-from {
  position: absolute;
  left: -100%;
}

.slide-left-leave-to {
  position: absolute;
  right: -100%;
}

.slide-left-leave-from {
  position: absolute;
  right: 0;
}
</style>
