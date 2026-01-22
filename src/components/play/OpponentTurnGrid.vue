<template>
  <GridLayers
    class="absolute md:relative w-full md:w-auto transition-all md:translate-x-0 duration-500 md:pointer-events-auto shrink-0"
    :class="[
      !playersTurn
        ? 'opacity-100 pointer-events-auto left-1/2 -translate-x-1/2 md:left-auto md:transform-none'
        : 'md:opacity-30 md:cursor-not-allowed opacity-0 translate-x-full pointer-events-none left-full md:left-auto md:transform-none',
    ]">
    <template #header>
      Opponent's turn!
    </template>
    <template #layer1>
      <ShipGrid
        v-model:layout="shipLayout" :color="playerColor" :is-draggable="false"
        class="absolute inset-0 size-full pointer-events-none" />
    </template>
    <template #layer2>
      <IndicatorGrid class="absolute inset-0" :board="playerBoardHitStates" board-type="player" />
    </template>
    <template #footer />
  </GridLayers>
</template>

<script setup lang="ts">
const { playerColor, shipLayout, playersTurn, playerBoardHitStates, getHitStateForAttack, opponentTarget, switchTurn } = useGame()
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
