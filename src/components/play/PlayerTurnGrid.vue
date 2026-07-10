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
        sunk
        class="absolute inset-0 size-full pointer-events-none" />
    </template>
    <template #layer2>
      <IndicatorGrid
        class="absolute inset-0" :board="opponentBoardHitStates" board-type="opponent"
        :disabled="targetingBlocked" @shoot="onShoot" />
    </template>
    <template #footer />
  </GridLayers>
</template>

<script setup lang="ts">
const { playersTurn, destroyedShips, opponentColor, setHitStateForOpponent, switchTurn, opponentBoardHitStates, playerTarget } = useGame()
const { onEvent, sendEvent } = useEvent()

const attackBlocked = ref(false)
const sunkAnimationBlocked = ref(false)
const targetingBlocked = computed(() => attackBlocked.value || sunkAnimationBlocked.value)
let sunkAnimationTimer: ReturnType<typeof setTimeout> | undefined
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
      const shipLength = Math.max(event.data.w, event.data.h)
      const animationDuration = (shipLength - 1) * 250 + 500

      sunkAnimationBlocked.value = true
      clearTimeout(sunkAnimationTimer)
      sunkAnimationTimer = setTimeout(() => {
        sunkAnimationBlocked.value = false
      }, animationDuration)

      // convert the received data back to a layout entry
      destroyedShips.value.push(event.data)
    }
  })
})

onUnmounted(() => {
  clearTimeout(sunkAnimationTimer)
  if (removeListener) removeListener()
})

function onShoot(x: number, y: number) {
  if (targetingBlocked.value) return
  if (!playerTarget.value) return
  if (playerTarget.value.x !== x || playerTarget.value.y !== y) return
  sendEvent({ data: { x, y }, type: 'attack' })
  attackBlocked.value = true
}
</script>
