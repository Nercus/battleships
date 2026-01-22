<template>
  <svg v-if="props.orientation === 'horizontal'" viewBox="0 0 444 104" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M100.456 2C31.6693 2 6.72344 42.1829 2.23041 50.6502C1.70229 51.6455 1.70391 52.763 2.23568 53.7564C6.74289 62.1759 31.6961 102 100.456 102C441.456 102 441.456 51.7953 441.456 51.7953C441.456 51.7953 441.456 1.99999 100.456 2Z"
      stroke="inherit" fill="inherit" stroke-width="8" />
  </svg>
  <svg v-else viewBox="0 0 104 444" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M102 100.456C102 31.6693 61.8171 6.72344 53.3498 2.23041C52.3545 1.70229 51.237 1.70391 50.2436 2.23568C41.8241 6.74289 2 31.6961 2 100.456C2 441.456 52.2047 441.456 52.2047 441.456C52.2047 441.456 102 441.456 102 100.456Z"
      stroke="inherit" fill="inherit" stroke-width="8" />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()
</script>
