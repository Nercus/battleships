<template>
  <div class="flex flex-col justify-center items-center gap-2 md:gap-4 w-full">
    <GridLayers>
      <template #layer1>
        <IndicatorGrid class="absolute inset-0" />
      </template>
      <template #layer2>
        <ShipGrid v-model:layout="shipLayout" :color="playerColor" is-draggable class="absolute inset-0 size-full" />
      </template>
      <template #toolbar>
        <SetupToolbar class="mt-2" />
      </template>
    </GridLayers>
    <SetupReadyButton />
  </div>
</template>

<script setup lang="ts">
const { playerColor, shipLayout } = useGame()
</script>
