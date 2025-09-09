<template>
  <AlertDialogRoot :open="gameState === 'ended'">
    <AlertDialogPortal>
      <AlertDialogOverlay class="z-30 fixed inset-0 bg-base-800/50 backdrop-blur-xs" />
      <AlertDialogContent
        class="top-1/2 left-1/2 z-50 fixed bg-base-100 drop-shadow p-8 rounded focus:outline-none w-full max-w-xl -translate-1/2">
        <AlertDialogTitle class="m-0 font-semibold">
          {{ playerWon ? 'You won!' : 'You lost!' }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-4 mb-5 text-sm leading-normal">
          {{ playerWon ? 'Congratulations! You are the captain of the seven seas!' : 'You have lost the game. Better luck next time! Keelhaul the captain!' }}
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogAction
            :as="Button" :type="newGameRequested ? 'ghost' : 'success'" @click="newGame">
            <span v-if="newGameRequested && !opponentRequestsNewGame" class="flex items-center gap-2">
              Waiting for other player...
              <Icon class="w-4 h-4 animate-spin fluent--spinner-ios-20-filled" />
            </span>
            <span v-else-if="!newGameRequested && opponentRequestsNewGame" class="flex items-center gap-2">
              Opponent wants a rematch! Join?
              <Icon class="w-4 h-4 fluent--checkmark-24-filled" />
            </span>
            <span v-else>Play Again</span>
          </AlertDialogAction>
          <AlertDialogAction
            :as="Button" type="error" @click="exitGame()">
            Exit Game
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import Button from './shared/Button.vue'

const { gameState, reset } = useGame()
const { onEvent, sendEvent } = useEvent()
const opponentRequestsNewGame = ref(false)
const newGameRequested = ref(false)
const playerWon = ref(false)
const router = useRouter()

let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'game-over') {
      gameState.value = 'ended'
      playerWon.value = true
    }
    else if (event.type === 'new-game') {
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

function exitGame() {
  push.error({
    duration: 5000,
    message: 'You have been disconnected.',
    title: 'Disconnected',
  })
  router.push({ name: 'Start Game' })
}
</script>
