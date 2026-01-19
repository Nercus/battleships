<template>
  <CommonButton
    :variant="shipsConfirmed ? 'muted' : 'success'" :disabled="!playerColor || !playerName"
    @click="confirmSelection">
    <span v-if="shipsConfirmed && !otherPlayerReady" class="flex items-center gap-2">
      Waiting for other player...
      <Icon class="w-4 h-4 animate-spin fluent--spinner-ios-20-filled" />
    </span>
    <span v-else-if="!shipsConfirmed && otherPlayerReady" class="flex items-center gap-2">
      Other player is ready! Are you?
      <Icon class="w-4 h-4 fluent--checkmark-24-filled" />
    </span>
    <span v-else>Confirm</span>
  </CommonButton>
</template>

<script setup lang="ts">
const { onEvent, sendEvent } = useEvent()
const { playerColor, playerName, opponentName } = useGame()

const router = useRouter()
const otherPlayerReady = ref(false)
const shipsConfirmed = ref(false)

watch(shipsConfirmed, (newValue) => {
  if (playerName.value) {
    sendEvent({ data: playerName.value, type: 'name' })
    sendEvent({ data: newValue, type: 'ready' })
  }
})

let removeReadyListener: () => void
let removeNameListener: () => void
onMounted(() => {
  removeReadyListener = onEvent((event) => {
    if (event.type === 'ready') {
      otherPlayerReady.value = event.data
    }
  })

  removeNameListener = onEvent((event) => {
    if (event.type === 'name') {
      opponentName.value = event.data
    }
  })
})

onUnmounted(() => {
  if (removeReadyListener) removeReadyListener()
  if (removeNameListener) removeNameListener()
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
