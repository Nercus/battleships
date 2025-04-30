<template>
  <AlertDialogRoot v-if="isGameStarted">
    <AlertDialogTrigger
      :as="Button" type="error" size="small">
      Exit Game
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="z-30 fixed inset-0 bg-base-800/50 backdrop-blur-xs" />
      <AlertDialogContent
        class="top-1/2 left-1/2 z-50 fixed bg-base-100 drop-shadow p-8 rounded focus:outline-none w-full max-w-lg -translate-1/2">
        <AlertDialogTitle class="m-0 font-semibold">
          Are you absolutely sure?
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-4 mb-5 text-sm leading-normal">
          This action will exit the game and close the connection to the other player. This action cannot be undone. Are you sure you want to exit the game?
        </AlertDialogDescription>
        <div class="flex justify-end gap-4">
          <AlertDialogCancel
            :as="Button" type="muted">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            :as="Button" type="error"
            @click="exitGame">
            Exit Game
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import Button from '../components/shared/Button.vue'

const router = useRouter()

const { gameState } = useGame()

const isGameStarted = computed(() => {
  return gameState.value !== 'idle'
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
