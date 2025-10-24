<template>
  <div class="flex md:flex-row flex-col justify-center items-center gap-2 md:gap-4 lg:gap-8 p-4 w-full h-full">
    <div class="relative background-grid aspect-square" style="width: min(70vw, 70vh, 40rem); height: min(70vw, 70vh, 40rem);">
      <GameGridShipLayer v-model:layout="shipLayout" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)] pointer-events-none" :color="playerColor" :is-draggable="false" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="playerBoardHitStates" title="Opponent's turn" board-type="player" />
    </div>
    <div class="hidden lg:block relative background-grid opacity-70 h-1/5 lg:h-1/3 aspect-square pointer-events-none">
      <GameGridShipLayer v-model:layout="destroyedShips" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="opponentColor" :is-draggable="false" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="opponentBoardHitStates" title="Your board" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { opponentBoardHitStates, opponentTarget, playerBoardHitStates } = useGame()
const { destroyedShips, getHitStateForAttack, opponentColor, playerColor, shipLayout, switchTurn } = useGame()
const { onEvent, sendEvent } = useEvent()

let removeListener: () => void

onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'attack') {
      const { x, y } = event.data
      const isHit = getHitStateForAttack(x, y)
      sendEvent({ data: !!isHit, type: 'attack-response' })
      opponentTarget.value = null
    }
    else if (event.type === 'acknowledge') {
      setTimeout(() => {
        switchTurn()
      }, 500)
    }
    else if (event.type === 'target') {
      const { x, y } = event.data
      opponentTarget.value = { x, y }
    }
  })
})

onUnmounted(() => {
  if (removeListener) removeListener()
})
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
