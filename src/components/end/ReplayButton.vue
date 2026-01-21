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
import type { Layout } from 'grid-layout-plus'

const { gameState, reset, playerBoardHitStates, shipLayout } = useGame()
const { onEvent, sendEvent } = useEvent()
const opponentRequestsNewGame = ref(false)
const newGameRequested = ref(false)
const playerWon = ref(false)
const router = useRouter()

const opponentBoardLayout = ref<Layout | null>()
const opponentBoardHits = ref<Board | null>()

let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'game-over') {
      gameState.value = 'ended'
      playerWon.value = true
      sendEvent({ type: 'game-info', data: { board: playerBoardHitStates.value, layout: shipLayout.value } })
    }
    else if (event.type === 'new-game') {
      opponentRequestsNewGame.value = true
    }
    else if (event.type === 'game-info' && gameState.value === 'ended') {
      const { board, layout } = event.data as { board: Board, layout: Layout }
      opponentBoardHits.value = board
      opponentBoardLayout.value = layout
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
