<template>
  <div class="aspect-square grid-cols-10 grid grid-rows-10 place-items-center">
    <GameGridHitIndicator v-for="i in 100" :key="i" />
  </div>
</template>

<script setup lang="ts">
</script>
