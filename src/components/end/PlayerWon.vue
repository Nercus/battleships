<template>
  <div class="flex flex-col justify-center items-center">
    <motion.div
      :initial="{ opacity: 0, scale: 0, rotate: 0 }"
      :animate="{ opacity: 1, scale: 1, rotate: 360 }"
      :transition="{
        duration: 3,
        rotate: {
          repeat: Infinity,
          ease: 'linear',
          duration: 8,
        },
      }" class="-z-10 fixed size-full">
      <Icon class="size-full text-warning/40 fluent--star-24-filled" />
    </motion.div>
    <div class="flex flex-col justify-center items-center gap-4">
      <motion.div
        class="w-full md:w-1/2" :initial="{ opacity: 0.5, scale: 0.5, y: '50%' }"
        :animate="{ opacity: 1, scale: 1, y: '0%' }"
        :transition="{ duration: 3 }">
        <h1 class="drop-shadow-lg mb-4 font-bold text-4xl md:text-6xl text-center">
          You Won!
        </h1>
        <TrophySVG class="w-full h-fit" :class="trophyVariants({ color: playerColor || 'white' })" />
      </motion.div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { motion } from 'motion-v'

const { playerColor } = useGame()

const trophyVariants = cva('', {
  defaultVariants: {
    color: 'white',
  },
  variants: {
    color: {
      blue: 'fill-distinct-6',
      emerald: 'fill-distinct-4',
      green: 'fill-distinct-3',
      indigo: 'fill-distinct-7',
      orange: 'fill-distinct-1',
      rose: 'fill-distinct-9',
      teal: 'fill-distinct-5',
      violet: 'fill-distinct-8',
      white: 'fill-white',
    },
  },
})
</script>
