<template>
  <div class="flex flex-col justify-center items-center">
    <div class="z-50 flex flex-col justify-center items-center gap-4">
      <h1 class="drop-shadow-lg mb-4 font-bold text-4xl md:text-6xl text-center">
        You Lost!
      </h1>
      <motion.div
        class="w-full md:w-1/2 pointer-events-none" :initial="{ x: '100%' }"
        :animate="{ x: '0%' }" :transition="{ duration: 5 }">
        <ShipSVG class="w-full h-fit" :class="shipVariants({ sunken: boatSunk, color: playerColor })" />
      </motion.div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { motion } from 'motion-v'

const { playerColor } = useGame()

const boatSunk = ref(false)

onMounted(() => {
  setTimeout(() => {
    boatSunk.value = true
  }, 5000)
})

const shipVariants = cva('', {
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
    sunken: {
      true: 'animated-sunken-boat',
      false: '',
    },
  },
})
</script>

<style scoped>
.animated-sunken-boat {
  animation: sink 3s ease-in-out forwards;
}

@keyframes sink {
  0% {
    transform: translateY(0px) rotate(0deg);
    opacity: 1;
  }

  60% {
    transform: translateY(20px) rotate(10deg);
    opacity: 1;
  }

  80% {
    transform: translateY(50px) rotate(40deg);
    opacity: 1;
  }

  100% {
    transform: translateY(80px) rotate(70deg);
    opacity: 0;
  }
}
</style>
