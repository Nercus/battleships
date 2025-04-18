<template>
  <div class="flex flex-row items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full">
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="opponentBoard" title="Your turn (Double click to shoot!)" board-type="opponent" @shoot="onShoot" />
    </div>
    <div class="pointer-events-none h-1/4 aspect-square background-grid opacity-70 relative">
      <GameGridShipLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="playerBoard" title="" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { activeAttack, opponentBoard, playerBoard } = storeToRefs(useGameStore())
const { setHitStateForOpponent, switchTurn } = useGameStore()
const { eventBus } = useConnectionStore()
const { sendEvent } = useConnectionStore()

let removeListener: () => void

onMounted(() => {
  removeListener = eventBus.on((event) => {
    if (event.type === 'attack-response') {
      const success = setHitStateForOpponent(event.data) // sets the state of the hit on the opponent's board
      if (!success) return
      setTimeout(() => {
        switchTurn()
      }, 1000)
      sendEvent({ type: 'acknowledge' })
    }
  })
})

onUnmounted(() => {
  if (removeListener) removeListener()
})

function onShoot(x: number, y: number) {
  activeAttack.value = { x, y }
  sendEvent({ data: { x, y }, type: 'attack' })
}
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
