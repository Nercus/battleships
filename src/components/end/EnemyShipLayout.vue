<template>
  <DialogRoot>
    <DialogTrigger as-child>
      <CommonButton variant="error">
        Enemy Board
      </CommonButton>
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="z-30 fixed inset-0 bg-base-300/70" />
      <DialogContent
        class="top-1/2 left-1/2 z-50 fixed flex flex-col justify-center items-center bg-base-100 shadow-2xl px-8 py-6 md:rounded-lg w-full sm:max-w-xl h-fit sm:max-h-4/5 -translate-1/2">
        <DialogTitle class="font-semibold text-xl">
          Enemy Board
        </DialogTitle>
        <div v-if="opponentBoardLayout && opponentBoardHitStates" class="relative shadow-shadow border-2 border-black size-80 landscape:max-lg:size-60 md:size-100">
          <ShipGrid
            v-model:layout="opponentBoardLayout" :color="opponentColor" :is-draggable="false"
            class="absolute inset-0 size-full pointer-events-none" />
          <IndicatorGrid class="absolute inset-0" :board="opponentBoardHitStates" board-type="player" />
        </div>
        <div v-else class="py-8">
          Cannot load enemy board.
        </div>
        <DialogClose as-child>
          <CommonButton class="top-2 right-2 absolute" variant="muted" size="icon">
            <Icon class="size-5 fluent--dismiss-12-filled" />
          </CommonButton>
        </DialogClose>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
import type { Layout } from 'grid-layout-plus'

const { onEvent, sendEvent } = useEvent()
const { opponentColor, gameState, playerBoardHitStates, shipLayout, opponentBoardHitStates, opponentBoardLayout } = useGame()

let removeListener: () => void
onMounted(() => {
  sendEvent({ type: 'game-info', data: { board: playerBoardHitStates.value, layout: shipLayout.value } })

  removeListener = onEvent((event) => {
    if (event.type === 'game-info' && gameState.value === 'ended') {
      const { board, layout } = event.data as { board: Board, layout: Layout }
      opponentBoardHitStates.value = board
      opponentBoardLayout.value = layout
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
})
</script>
