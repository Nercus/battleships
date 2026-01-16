<template>
  <div class="flex size-full">
    <div class="relative flex flex-row justify-center items-center size-full overflow-hidden md:overflow-visible">
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
          <IndicatorGrid class="absolute inset-0" :board="opponentBoardHitStates" board-type="opponent" />
        </template>
        <template #footer />
      </GridLayers>

      <Separator class="hidden md:block bg-base-700 mx-2 w-px h-full max-h-1/2" orientation="vertical" />

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
          <IndicatorGrid class="absolute inset-0" :board="playerBoardHitStates" board-type="player" />
        </template>
        <template #layer2>
          <ShipGrid v-model:layout="shipLayout" :color="playerColor" :is-draggable="false" class="absolute inset-0 size-full pointer-events-none" />
        </template>
        <template #footer />
      </GridLayers>
    </div>
  </div>
</template>

<script setup lang="ts">
const { playerColor, shipLayout, playersTurn, opponentBoardHitStates, playerBoardHitStates } = useGame()
</script>
