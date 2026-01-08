<template>
  <div class="relative size-100">
    <IndicatorGrid class="absolute inset-0" />
    <ShipGrid v-model:layout="shipLayout" :color="playerColor" is-draggable class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" />
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
