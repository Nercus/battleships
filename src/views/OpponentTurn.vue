<template>
  <div class="flex flex-row items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full">
      <GameGridShipLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)] pointer-events-none" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="playerBoard" title="Opponent's turn" board-type="player" />
    </div>
    <GameGridHitLayer class="pointer-events-none h-1/4 aspect-square background-grid opacity-70 relative" :board="opponentBoard" title="" />
  </div>
</template>

<script setup lang="ts">
const { enemyTarget, opponentBoard, playerBoard } = storeToRefs(useGameStore())
const { getHitStateForAttack, switchTurn } = useGameStore()
const { eventBus, sendEvent } = useConnectionStore()

let removeListener: () => void

onMounted(() => {
  removeListener = eventBus.on((event) => {
    if (event.type === 'attack') {
      const { x, y } = event.data
      const isHit = getHitStateForAttack(x, y)
      sendEvent({ data: !!isHit, type: 'attack-response' })
      enemyTarget.value = null
    }
    else if (event.type === 'acknowledge') {
      setTimeout(() => {
        switchTurn()
      }, 1000)
    }
    else if (event.type === 'target') {
      const { x, y } = event.data
      enemyTarget.value = { x, y }
    }
  })
})

onUnmounted(() => {
  if (removeListener) removeListener()
})
</script>

<style lang="css">
.background-grid {
  background-image: linear-gradient(#000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px)), linear-gradient(90deg, #000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px));
  background-size: 10% 10%;
  border: 1px solid #000000;
}
</style>
