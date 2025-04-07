<template>
  <div class="relative">
    <div class="aspect-square bg-base-900 grid grid-cols-10 gap-px w-fit h-fit border border-base-900">
      <GameGridEntry v-for="i in 100" :key="i" />
    </div>
    <GameGridShipLayer class="absolute inset-0 w-full h-full pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
</script>
