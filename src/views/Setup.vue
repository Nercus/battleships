<template>
  <div class="flex flex-col justify-center items-center gap-4 w-full h-full">
    <h1 class="z-10 font-black text-lg tracking-wide">
      Setup your ships
    </h1>
    <div class="relative background-grid aspect-square" :class="{ 'pointer-events-none': shipsConfirmed }" style="width: min(70vw, 70vh, 40rem); height: min(70vw, 70vh, 40rem);">
      <GameGridLabels vertical />
      <GameGridLabels horizontal />
      <GameGridShipLayer v-model:layout="shipLayout" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="playerColor" is-draggable />
    </div>
    <ColorSelectMenu />
    <Button :type="shipsConfirmed ? 'ghost' : 'success'" :disabled="!playerColor" @click="confirmSelection">
      <span v-if="shipsConfirmed && !otherPlayerReady" class="flex items-center gap-2">
        Waiting for other player...
        <Icon class="w-4 h-4 animate-spin fluent--spinner-ios-20-filled" />
      </span>
      <span v-else-if="!shipsConfirmed && otherPlayerReady" class="flex items-center gap-2">
        Other player is ready! Are you?
        <Icon class="w-4 h-4 fluent--checkmark-24-filled" />
      </span>
      <span v-else>Confirm</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { onEvent, sendEvent } = useEvent()
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
  removeListener = onEvent((event) => {
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
.background-grid::before {
  content: '';
  background-size: calc(calc(100% - 2px) / 10) calc(calc(100% - 2px) / 10);
  background-image:
    linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px);
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  position: absolute;
  background-repeat: repeat;
  margin: 2px;
}
</style>
