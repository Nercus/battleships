<template>
  <AlertDialogRoot v-if="isGameStarted">
    <AlertDialogTrigger
      :as="Button" type="error" size="small">
      Exit Game
    </AlertDialogTrigger>
    <AlertDialogPortal>
      <AlertDialogOverlay class="bg-base-800/50 backdrop-blur-xs fixed inset-0 z-30" />
      <AlertDialogContent
        class="z-50 bg-base-100 rounded drop-shadow fixed top-1/2 left-1/2 w-full max-w-lg -translate-1/2 p-8 focus:outline-none">
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
            @click="handleAction">
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

const gameStore = useGameStore()
const {connected} = storeToRefs(useConnectionStore())
const { gameState } = storeToRefs(gameStore)
const isGameStarted = computed(() => {
  return gameState.value !== 'idle'
})

function handleAction() {
  if (!connected.value) {
    push.error({
      title: 'Disconnected',
      message: 'You have been disconnected.',
      duration: 5000,
    })
    router.push({ name: 'Start Game' })
    return
  }
  gameStore.$reset()
  push.success({
    title: 'Game exited',
    message: 'You have exited the game.',
    duration: 5000,
  })
  router.push({
    name: 'Setup'
  })
}
</script>
