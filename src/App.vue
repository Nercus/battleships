<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>

  <div class="fixed top-0 w-fit max-w-1/2 h-fit bg-base-100 mx-auto inset-x-0 p-2 drop-shadow rounded-b">

    {{ gameDebug }}
  </div>

  <div class="w-dvw h-dvh bg-base-100 overflow-hidden flex flex-col items-center justify-center">
    <RouterView />
  </div>
  <ConnectionIndicator />
</template>

<script setup lang="ts">
import { Notification, Notivue } from 'notivue'
import { RouterView } from 'vue-router'

const game = useGame()
const gameDebug = computed(() => {

  // return an object without the ones that are arrays
  return Object.fromEntries(
    Object.entries(game).filter(([key]) => key != 'playerBoard'&& key != 'opponentBoard')
  )
})

const { connected } = useConnection()
const router = useRouter()

watch(connected, (val, oldVal) => {
  if (val) {
    push.success({
      title: 'Connected',
      message: 'You are now connected.',
      duration: 5000,
    })
    router.push({ name: 'Setup' })
  }
  if (!val && !!oldVal) {
    push.error({
      title: 'Disconnected',
      message: 'You have been disconnected.',
      duration: 5000,
    })
    router.push({ name: 'Start Game' })
  }
}, { immediate: true })

window.addEventListener('beforeunload', (event) => {
  if (import.meta.env.MODE === 'development') return
  if (!connected.value) return
  // Custom message may not display in modern browsers, but this will trigger a confirmation dialog
  event.preventDefault()
})

function showWarning() {
  push.warning({
    title: 'Warning',
    message: 'Refreshing the page will end the connection. Please use the browser\'s reload button instead, if you insist on refreshing.',
    duration: 5000,
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
