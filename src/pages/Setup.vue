<template>
  <GridLayers>
    <template #layer1>
      <IndicatorGrid class="absolute inset-0" />
    </template>
    <template #layer2>
      <ShipGrid v-model:layout="shipLayout" :color="playerColor" is-draggable class="absolute inset-0 size-full" />
    </template>
  </GridLayers>
</template>

<script setup lang="ts">
const { getRandomLayout, playerColor, shipLayout } = useGame()

function randomizeLayout() {
  shipLayout.value = getRandomLayout()
}

onMounted(() => {
  randomizeLayout()
  playerColor.value = 'emerald'
})
</script>
