<template>
  <div class="relative size-100">
    <IndicatorGrid class="absolute inset-0" />
    <ShipGrid v-model:layout="shipLayout" :color="playerColor" is-draggable class="absolute inset-0 size-full" />
  </div>
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
