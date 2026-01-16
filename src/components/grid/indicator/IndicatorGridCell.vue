<template>
  <button class="flex justify-center items-center hover:bg-base-300 rounded-full size-7 md:size-10 cursor-pointer disabled:pointer-events-none" :disabled="props.disabled">
    <motion.div class="bg-base-700 rounded-full outline outline-transparent size-2" :animate="indicatorAnimation" />
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

const { playerTarget, opponentTarget } = useGame()

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

const redColor = getComputedStyle(document.documentElement).getPropertyValue('--color-error').trim()
const greyColor = getComputedStyle(document.documentElement).getPropertyValue('--color-base-300').trim()
const blackColor = 'black'

const indicatorAnimation = computed(() => {
  if (indicatorType.value === 'hit') {
    return { width: '2rem', height: '2rem', backgroundColor: redColor, outlineOffset: '0rem', outlineColor: redColor }
  }
  else if (indicatorType.value === 'miss') {
    return { width: '2rem', height: '2rem', backgroundColor: greyColor, outlineOffset: '0rem', outlineColor: greyColor }
  }
  else if (indicatorType.value === 'opponent-target') {
    return { width: '0.5rem', height: '0.5rem', backgroundColor: redColor, outlineOffset: '1rem', outlineColor: redColor }
  }
  else if (indicatorType.value === 'player-target') {
    return { width: '0.5rem', height: '0.5rem', backgroundColor: blackColor, outlineOffset: '1rem', outlineColor: blackColor }
  }
  else {
    return { width: '0.5rem', height: '0.5rem', backgroundColor: blackColor, outlineOffset: '0rem', outlineColor: 'transparent' }
  }
})
</script>
