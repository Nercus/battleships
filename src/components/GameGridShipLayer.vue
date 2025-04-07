<template>
  <div class="aspect-square  grid grid-cols-10 gap-px w-fit h-fit border  grid-rows-10">
    <GameGridShip class="col-start-4 col-end-7 row-start-5 row-end-5" is-hit />

    <GameGridShip class="col-start-8 col-end-10 row-start-2 row-end-2" />
    <GameGridShip class="col-start-1 col-end-4 row-start-8 row-end-8 rotate-90" is-hit />
    <GameGridShip class="rotate-90 col-start-7 col-end-10 row-start-9 row-end-9" />
  </div>
</template>

<script setup lang="ts">

</script>
