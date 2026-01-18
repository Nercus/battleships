<template>
  <div class="flex flex-col justify-center items-center gap-4 size-full">
    <div class="relative flex flex-row justify-center items-center size-full overflow-hidden md:overflow-visible">
      <PlayerTurnGrid />
      <Separator class="hidden md:block bg-base-700 mx-2 w-px h-full max-h-1/2" orientation="vertical" />
      <OpponentTurnGrid />
    </div>
    <PlayToolbar class="mb-4" />
  </div>
</template>

<script setup lang="ts">

</script>
