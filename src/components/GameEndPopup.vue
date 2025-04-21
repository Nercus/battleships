<template>
  <AlertDialogRoot :open="gameState === 'ended'">
    <AlertDialogPortal>
      <AlertDialogOverlay class="bg-base-800/50 backdrop-blur-xs fixed inset-0 z-30" />
      <AlertDialogContent
        class="z-50 bg-base-100 rounded drop-shadow fixed top-1/2 left-1/2 w-full max-w-lg -translate-1/2 p-8 focus:outline-none">
        <AlertDialogTitle class="m-0 font-semibold">
          {{ playerWon ? 'You won!' : 'You lost!' }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-4 mb-5 text-sm leading-normal">
          {{ playerWon ? 'Congratulations! You are the captain of the seven seas!' : 'You have lost the game. Better luck next time! Keelhaul the captain!' }}
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
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

const { gameState } = useGame()
const { eventBus } = useConnection()
const playerWon = ref(false)
const router = useRouter()

let removeListener: () => void
onMounted(() => {
  removeListener = eventBus.on((event) => {
    if (event.type === 'game-over') {
      gameState.value = 'ended'
      playerWon.value = true
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
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
