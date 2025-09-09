<template>
  <div class="flex md:flex-row flex-col justify-center items-center gap-4 md:gap-8 p-4 w-full h-full">
    <div class="relative background-grid w-full max-w-xl max-h-full aspect-square">
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
.background-grid {
  background-image:
    linear-gradient(#000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px)),
    linear-gradient(90deg, #000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px));
  background-size: 10% 10%;
  border: 1px solid #000000;
}
</style>
