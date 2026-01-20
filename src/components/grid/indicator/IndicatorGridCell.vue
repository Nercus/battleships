<template>
  <button class="flex justify-center items-center enabled:hover:bg-base-300 rounded-full size-8 landscape:max-lg:size-6 md:size-10 cursor-pointer disabled:pointer-events-none" :disabled="props.disabled || !hittable">
    <motion.div class="bg-base-700 rounded-full outline-4 outline-transparent size-2" :animate="indicatorAnimation" />
  </button>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const props = defineProps<{
  type: HitType
  boardType?: 'opponent' | 'player'
  index: number
  disabled?: boolean
}>()

const { playerTarget, opponentTarget, playersTurn } = useGame()

const x = computed(() => {
  return Math.floor(props.index / 10)
})
const y = computed(() => {
  return props.index % 10
})

const isOpponentsBoard = computed(() => {
  return props.boardType === 'opponent'
})

const isPlayerBoard = computed(() => {
  return props.boardType === 'player'
})

const indicatorType = computed(() => {
  if (props.type !== 'none') {
    return props.type
  }

  if (opponentTarget.value?.x === x.value && opponentTarget.value?.y === y.value && isPlayerBoard.value) {
    return 'opponent-target'
  }

  if (playerTarget.value?.x === x.value && playerTarget.value?.y === y.value && isOpponentsBoard.value) {
    return 'player-target'
  }

  return 'default'
})

const hittable = computed(() => {
  return props.type === 'none' || indicatorType.value === 'player-target' || indicatorType.value === 'opponent-target'
})

const redColor = getComputedStyle(document.documentElement).getPropertyValue('--color-error').trim()
const greyColor = getComputedStyle(document.documentElement).getPropertyValue('--color-base-700').trim()
const blackColor = 'black'

const indicatorAnimation = computed(() => {
  if (indicatorType.value === 'hit') {
    return { width: '1.5rem', height: '1.5rem', backgroundColor: redColor, outlineOffset: '0rem', outlineColor: 'transparent' }
  }
  else if (indicatorType.value === 'miss') {
    return { width: '1.5rem', height: '1.5rem', backgroundColor: greyColor, outlineOffset: '0rem', outlineColor: 'transparent' }
  }
  else if (indicatorType.value === 'opponent-target' && !playersTurn.value) {
    return { width: '0.5rem', height: '0.5rem', backgroundColor: redColor, outlineOffset: '0.5rem', outlineColor: redColor }
  }
  else if (indicatorType.value === 'player-target' && playersTurn.value) {
    return { width: '0.5rem', height: '0.5rem', backgroundColor: blackColor, outlineOffset: '0.5rem', outlineColor: blackColor }
  }
  else {
    return { width: '0.5rem', height: '0.5rem', backgroundColor: blackColor, outlineOffset: '0rem', outlineColor: 'transparent' }
  }
})
</script>
