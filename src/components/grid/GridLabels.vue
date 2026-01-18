<template>
  <div :class="labelBarStyle({ orientation })">
    <span v-for="(label, index) in labels" :key="index" :class="labelStyle({ orientation })">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'

const props = defineProps<{
  orientation: 'horizontal' | 'vertical'
}>()

const labelBarStyle = cva('flex justify-between font-bold text-tiny text-base-700/30 select-none', {
  variants: {
    orientation: {
      horizontal: 'w-80 md:w-100 text-center',
      vertical: 'h-80 md:h-100 flex-col text-center',
    },
  },
})

const labelStyle = cva('flex justify-center items-center', {
  variants: {
    orientation: {
      horizontal: 'w-8 md:w-10',
      vertical: 'h-8 md:h-10',
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
