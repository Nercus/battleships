<template>
  <div class="flex flex-row items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full">
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="opponentBoard" title="Your attacks (Double click to shoot!)" />
    </div>
    <div class="pointer-events-none h-1/4 aspect-square background-grid opacity-70 relative">
      <GameGridShipLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="playerBoard" title="Opponent's attacks" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { opponentBoard, playerBoard } = storeToRefs(useGameStore())
const { setHitStateForOpponent } = useGameStore()
const { onEventReceive } = useConnectionStore()

onEventReceive((event) => {
  if (event.type === 'hit') {
    setHitStateForOpponent(event.data) // sets the state of the hit on the opponent's board
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
