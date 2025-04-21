<template>
  <div class="flex flex-row items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full">
      <GameGridShipLayer v-model:layout="destroyedShips" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="opponentColor" :is-draggable="false" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="opponentBoardHitStates" title="Your turn (Double click to shoot!)" board-type="opponent" :class="{ 'pointer-events-none': attackBlocked }" @shoot="onShoot" />
    </div>
    <div class="pointer-events-none h-1/5 aspect-square background-grid opacity-70 relative">
      <GameGridShipLayer v-model:layout="shipLayout" class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="playerColor" :is-draggable="false" />
      <GameGridHitLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="playerBoardHitStates" title="" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { opponentBoardHitStates, playerBoardHitStates, playerTarget } = useGame()
const { destroyedShips, opponentColor, playerColor, setHitStateForOpponent, shipLayout, switchTurn } = useGame()
const { eventBus, sendEvent } = useConnection()

const attackBlocked = ref(false)
let removeListener: () => void
onMounted(() => {
  removeListener = eventBus.on((event) => {
    if (event.type === 'attack-response') {
      const success = setHitStateForOpponent(event.data) // sets the hit state where the player shot on the opponent's board
      if (!success) return
      // if the attack was a hit then the player can shoot again, switch turn though when it's a miss
      if (event.data) {
        attackBlocked.value = false
        return
      }
      // miss
      setTimeout(() => {
        switchTurn()
        attackBlocked.value = false
      }, 500)
      sendEvent({ type: 'acknowledge' }) // acknowledge the attack response so the opponent can switch turn
    }
    else if (event.type === 'ship-destroyed') {
      // convert the received data back to a layout entry
      destroyedShips.value.push(event.data)
    }
  })
})

onUnmounted(() => {
  if (removeListener) removeListener()
})

function onShoot(x: number, y: number) {
  if (attackBlocked.value) return
  if (!playerTarget.value) return
  if (playerTarget.value.x !== x || playerTarget.value.y !== y) return
  sendEvent({ data: { x, y }, type: 'attack' })
  attackBlocked.value = true
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
