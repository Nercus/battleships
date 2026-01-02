<template>
  <svg v-if="props.orientation === 'horizontal'" width="554" height="104" viewBox="0 0 554 104" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2" width="550" height="100" rx="12" stroke="inherit" stroke-width="4" stroke-dasharray="8 8" />
  </svg>
  <svg v-else width="104" height="554" viewBox="0 0 104 554" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="102" y="2" width="550" height="100" rx="12" transform="rotate(90 102 2)" stroke="inherit" stroke-width="4"
      stroke-dasharray="8 8" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()
</script>
