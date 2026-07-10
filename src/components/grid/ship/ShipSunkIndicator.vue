<template>
  <div
    class="absolute inset-0 flex size-full pointer-events-none"
    :class="orientation === 'horizontal' ? 'flex-row' : 'flex-col'">
    <motion.div
      v-for="i in length"
      :key="i"
      class="flex flex-1 justify-center items-center opacity-0"
      :animate="{ opacity: 1 }"
      :transition="{ delay: (i - 1) * 0.25, duration: 0.5 }">
      <Icon class="size-full text-error fluent--dismiss-16-filled" />
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

defineProps<{
  length: number
  orientation: 'horizontal' | 'vertical'
}>()
</script>
