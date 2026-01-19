<template>
  <div class="flex flex-col justify-center items-center gap-4 w-full h-full">
    <h1 class="z-10 font-black text-lg tracking-wide">
      Setup your ships
    </h1>

    <div class="relative aspect-square" :class="{ 'pointer-events-none': shipsConfirmed }" style="width: min(70vw, 70vh, 40rem); height: min(70vw, 70vh, 40rem);">
      <GameGridLabels vertical />
      <GameGridLabels horizontal />
      <GameGridShipLayer v-model:layout="shipLayout" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="playerColor" is-draggable />
      <Button type="muted" size="small" square class="top-2 -right-2 absolute translate-x-full" @click="randomizeLayout">
        <Icon class="size-5 fluent--arrow-shuffle-24-filled" />
      </Button>
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

function randomizeLayout() {
  shipLayout.value = getRandomLayout()
}

watch(shipsConfirmed, (newValue) => {
  if (newValue !== undefined) {
    sendEvent({ data: newValue, type: 'ready' })
  }
})

let removeListener: () => void
onMounted(() => {
  // set a random layout here
  randomizeLayout()
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
    router.push('/coin-flip')
  }
})

function confirmSelection() {
  shipsConfirmed.value = !shipsConfirmed.value
}
</script>
