<template>
  <div class="flex-col">
    <GridLabels orientation="horizontal" />
    <div class="flex flex-row">
      <GridLabels orientation="vertical" />
      <div class="relative size-70 md:size-100">
        <slot name="layer1" />
        <slot name="layer2" />
      </div>
      <GridLabels orientation="vertical" />
    </div>
    <GridLabels orientation="horizontal" />
  </div>
</template>

<script setup lang="ts">

</script>
