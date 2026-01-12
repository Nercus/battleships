<template>
  <div :class="labelStyle({ orientation })">
    <span v-for="(label, index) in labels" :key="index" class="block" :style="orientation === 'horizontal' ? `width: calc(10%);` : `height: calc(10%);`">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'

const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()

const labelStyle = cva('flex justify-between shadow-sm border border-base-200 rounded-full font-bold text-sm text-base-700/50 select-none', {
  variants: {
    orientation: {
      horizontal: 'w-70 md:w-100 text-center my-px',
      vertical: 'h-70 md:h-100 flex-col align-center mx-px text-center',
    },
  },
})

const labels = computed(() => {
  if (props.orientation === 'horizontal') {
    return Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i)) // A-J
  }
  else {
    return Array.from({ length: 10 }, (_, i) => (i + 1).toString()) // 1-10
  }
})
</script>
