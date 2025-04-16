<template>
  <div class="flex flex-row items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full">
      <GameGridShipLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)] pointer-events-none" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="playerBoard" title="Opponent's attacks" />
    </div>
    <GameGridHitLayer class="pointer-events-none h-1/4 aspect-square background-grid opacity-70 relative" :board="opponentBoard" title="Your attacks" />
  </div>
</template>

<script setup lang="ts">
const { opponentBoard, playerBoard } = storeToRefs(useGameStore())
const { getHitStateForAttack, switchTurn } = useGameStore()
const { onEventReceive, sendEvent } = useConnectionStore()

onEventReceive((event) => {
  if (event.type === 'attack') {
    const { x, y } = event.data
    const isHit = getHitStateForAttack(x, y)
    sendEvent({ type: 'attack-response', data: !!isHit })
  }
  else if (event.type === 'acknowledge') {
    switchTurn()
  }
})
</script>

<style lang="css">
.background-grid {
  background-image: linear-gradient(#000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px)), linear-gradient(90deg, #000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px));
  background-size: 10% 10%;
  border: 1px solid #000000;
}
</style>
