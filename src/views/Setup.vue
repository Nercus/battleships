<template>
  <div class="flex flex-col items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full" :class="{ 'pointer-events-none': shipsConfirmed }">
      <GameGridLabels vertical />
      <GameGridLabels horizontal />
      <GameGridShipLayer v-model:layout="shipLayout" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="playerColor" is-draggable />
    </div>
    <ColorSelectMenu />
    <Button :type="shipsConfirmed ? 'ghost' : 'success'" :disabled="!playerColor" @click="confirmSelection">
      <span v-if="shipsConfirmed && !otherPlayerReady" class="flex items-center gap-2">
        Waiting for other player...
        <Icon class="fluent--spinner-ios-20-filled animate-spin h-4 w-4" />
      </span>
      <span v-else-if="!shipsConfirmed && otherPlayerReady" class="flex items-center gap-2">
        Other player is ready! Are you?
        <Icon class="fluent--checkmark-24-filled h-4 w-4" />
      </span>
      <span v-else>Confirm</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { eventBus, sendEvent } = useConnection()
const { getRandomLayout, playerColor, shipLayout } = useGame()
const otherPlayerReady = ref(false)
const shipsConfirmed = ref(false)

watch(shipsConfirmed, (newValue) => {
  if (newValue !== undefined) {
    sendEvent({ data: newValue, type: 'ready' })
  }
})

let removeListener: () => void
onMounted(() => {
  // set a random layout here
  shipLayout.value = getRandomLayout()
  removeListener = eventBus.on((event) => {
    if (event.type === 'ready') {
      otherPlayerReady.value = event.data
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
})

watchEffect(() => {
  if (otherPlayerReady.value && shipsConfirmed.value) {
    router.push('/start')
  }
})

function confirmSelection() {
  shipsConfirmed.value = !shipsConfirmed.value
}
</script>

<style lang="css">
.background-grid {
  background-image:
    linear-gradient(#000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px)),
    linear-gradient(90deg, #000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px));
  background-size: 10% 10%;
  border: 1px solid #000000;
}
</style>
