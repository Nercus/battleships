<template>
  <div
    class="w-full h-full rounded-full aspect-square shadow-inner"
    :class="{
      'bg-base-300': !isSelected,
      'bg-primary': isSelected,
      'bg-secondary': isSelected && isCorrect,
      'bg-error': isSelected && !isCorrect,
    }" @click="isSelected = !isSelected" />
</template>

<script setup lang="ts">
const isSelected = ref(false)
const isCorrect = ref(false)
</script>
