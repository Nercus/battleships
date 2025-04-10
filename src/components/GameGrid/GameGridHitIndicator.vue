<template>
  <div
    class="w-full h-full rounded-full aspect-square"
    :class="{
      'bg-transparent': !isSelected && !isCorrect,
      'bg-primary': isSelected && !isCorrect,
      'bg-error': isSelected && isCorrect,
    }" @click="handleClick()" />
</template>

<script setup lang="ts">
const isSelected = ref(false)
const isCorrect = ref(false)

function handleClick() {
  isSelected.value = !isSelected.value
  isCorrect.value = Math.random() > 0.5 // Simulate a hit or miss
}
</script>
