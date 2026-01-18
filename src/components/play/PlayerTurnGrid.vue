<template>
  <GridLayers
    class="absolute md:relative w-full md:w-auto transition-all md:translate-x-0 duration-500 md:pointer-events-auto shrink-0"
    :class="[
      playersTurn
        ? 'opacity-100 pointer-events-auto left-1/2 -translate-x-1/2 md:left-auto md:transform-none'
        : 'md:opacity-30 md:cursor-not-allowed opacity-0 -translate-x-full pointer-events-none left-0 md:left-auto md:transform-none',
    ]">
    <template #header>
      Your turn!
    </template>
    <template #layer1>
      <ShipGrid
        v-model:layout="destroyedShips" :color="opponentColor" :is-draggable="false"
        class="absolute inset-0 size-full pointer-events-none" />
    </template>
    <template #layer2>
      <IndicatorGrid class="absolute inset-0" :board="opponentBoardHitStates" board-type="opponent" @shoot="onShoot" />
    </template>
    <template #footer />
  </GridLayers>
</template>

<script setup lang="ts">
const { playersTurn, destroyedShips, opponentColor, setHitStateForOpponent, switchTurn, opponentBoardHitStates, playerTarget } = useGame()
const { onEvent, sendEvent } = useEvent()

const attackBlocked = ref(false)
let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
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
