<template>
  <motion.div
    :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{
      duration: 3,
    }" class="landscape:max-lg:hidden block">
    <div class="gap-4 grid grid-cols-2 md:grid-cols-4 px-8">
      <div v-for="(stat, key) in stats" :key="key" class="flex flex-col justify-center items-center bg-base-100 shadow-shadow p-4 border-2">
        <Icon :class="statVariants({ type: key })" class="size-10" />
        <h2 class="mb-2 font-medium text-lg text-center">
          {{ stat.label }}
        </h2>
        <p class="font-bold text-2xl">
          {{ stat.value }}
        </p>
      </div>
    </div>
  </motion.div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { motion } from 'motion-v'

const { destroyedShips, opponentBoardHitStates } = useGame()

const shipsDestroyed = computed(() => {
  return destroyedShips.value.length
})

const hits = computed(() => opponentBoardHitStates.value.flat().flat().filter(state => state === 'hit').length)
const misses = computed(() => opponentBoardHitStates.value.flat().flat().filter(state => state === 'miss').length)
const accuracy = computed(() => {
  const totalShots = hits.value + misses.value
  return totalShots === 0 ? 0 : Math.round((hits.value / totalShots) * 100)
})

const statVariants = cva('', {
  variants: {
    type: {
      shipsDestroyed: 'text-primary fluent--vehicle-ship-16-filled',
      hits: 'text-success fluent--target-16-filled',
      misses: 'text-error fluent--circle-off-16-filled',
      accuracy: 'text-warning fluent--arrow-move-inward-20-filled',
    },
  },
})

const stats = computed(() => ({
  shipsDestroyed: {
    label: 'Ships Destroyed',
    value: shipsDestroyed.value,
  },
  hits: {
    label: 'Hits',
    value: hits.value,
  },
  misses: {
    label: 'Misses',
    value: misses.value,
  },
  accuracy: {
    label: 'Accuracy',
    value: `${accuracy.value}%`,
  },
}))
</script>
