<!-- eslint-disable vue/component-name-in-template-casing -->
<template>
  <div class="flex flex-col items-center">
    <span class="w-full text-center italic">N</span>
    <motion.div :animate="{ rotate: rotation }" :initial="{ rotate: 0 }" :transition="{ type: 'spring', duration: 3 }">
      <img src="../assets/logo.svg" alt="Compass Logo">
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const rotation = ref(Math.random() * 360)

useInterval(3000, {
  callback: () => {
    rotation.value = Math.random() * 360
  },
})
</script>
