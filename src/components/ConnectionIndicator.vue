<template>
  <div v-if="isGameStarted">
    <Transition name="rotate" mode="out-in">
      <div v-if="isConnected" class="bg-success p-0.5 rounded-full size-6 text-white">
        <Icon
          class="w-full h-full fluent--plug-connected-20-regular" />
      </div>
      <div v-else class="bg-error p-0.5 rounded-full size-6 text-white">
        <Icon
          class="w-full h-full fluent--plug-disconnected-20-regular" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { isConnected } = useConnection()

const { gameState } = useGame()
const isGameStarted = computed(() => {
  return gameState.value !== 'idle'
})

const router = useRouter()
const route = useRoute()

watch(isConnected, () => {
  if (isConnected.value) {
    push.success({
      duration: 5000,
      message: 'You are now connected.',
      title: 'Connected',
    })
    router.push({ name: 'Setup' })
  }
  if (!isConnected.value && route.meta.requiresConnection) {
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
