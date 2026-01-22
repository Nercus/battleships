<template>
  <CommonButton :variant="newGameRequested ? 'muted' : 'success'" @click="newGame">
    <span
      v-if="newGameRequested && !opponentRequestsNewGame"
      class="flex items-center gap-2 max-w-full wrap-break-word whitespace-normal">
      Waiting for other player...
      <Icon class="w-4 h-4 animate-spin fluent--spinner-ios-20-filled" />
    </span>
    <span
      v-else-if="!newGameRequested && opponentRequestsNewGame"
      class="flex items-center gap-2 max-w-full wrap-break-word whitespace-normal">
      Opponent wants a rematch! Join?
      <Icon class="w-4 h-4 fluent--checkmark-24-filled" />
    </span>
    <span v-else class="whitespace-normal">Play Again</span>
  </CommonButton>
</template>

<script setup lang="ts">
const { reset } = useGame()
const { onEvent, sendEvent } = useEvent()
const opponentRequestsNewGame = ref(false)
const newGameRequested = ref(false)
const playerWon = ref(false)
const router = useRouter()

let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'new-game') {
      opponentRequestsNewGame.value = true
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
})

function newGame() {
  sendEvent({ type: 'new-game' })
  newGameRequested.value = true
}

watch(() => newGameRequested.value && opponentRequestsNewGame.value, (newVal) => {
  if (!newVal) return
  reset()
  playerWon.value = false
  opponentRequestsNewGame.value = false
  newGameRequested.value = false
  router.push({ name: 'Setup' })
})
</script>
