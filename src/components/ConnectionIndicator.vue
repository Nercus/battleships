<template>
  <div v-if="isGameStarted">
    <Transition name="rotate" mode="out-in">
      <div v-if="connected" class="bg-success text-white size-6 p-0.5 rounded-full">
        <Icon
          class="fluent--plug-connected-20-regular w-full h-full" />
      </div>
      <div v-else class="bg-error text-white size-6 p-0.5 rounded-full">
        <Icon
          class="fluent--plug-disconnected-20-regular w-full h-full" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { connected } = useConnection()

const { gameState } = useGame()
const isGameStarted = computed(() => {
  return gameState.value !== 'idle'
})

const router = useRouter()
const route = useRoute()

const currentRouteNeedsConnection = computed(() => {
  return route.meta.requiresConnection
})

watch(connected, (val) => {
  if (val) {
    push.success({
      duration: 5000,
      message: 'You are now connected.',
      title: 'Connected',
    })
    router.push({ name: 'Setup' })
  }
  if (!val && currentRouteNeedsConnection.value) {
    push.error({
      duration: 5000,
      message: 'You have been disconnected.',
      title: 'Disconnected',
    })
    router.push({ name: 'Start Game' })
  }
}, { immediate: true })
</script>

<style>
@keyframes rotate {
  0% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.rotate-enter-active {
  animation: rotate 0.2s;
}

.rotate-leave-active {
  animation: rotate 0.2s reverse;
}
</style>
