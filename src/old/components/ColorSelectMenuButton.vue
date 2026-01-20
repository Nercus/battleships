<template>
  <Button type="primary" square size="huge" :class="[coloredButtonClass(colorNumber, isSelected), isSelected ? '' : '']" :disabled="isOpponentSelected">
    <div v-if="isOpponentSelected" class="relative flex justify-center items-center bg-base-100 rounded-full w-full h-full">
      <Icon class="bg-error fluent--presence-blocked-20-regular" />
    </div>
    <Icon v-else-if="isSelected" class="bg-base-100 size-full fluent--checkmark-12-filled" />
  </Button>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

defineProps<{
  colorNumber: number
  isSelected: boolean
  isOpponentSelected: boolean
}>()

const colorVariants = cva(
  'p-1 md:p-3 size-8 landscape:max-lg:size-6 md:size-10',
  {
    defaultVariants: {
      colorNumber: 1,
    },
    variants: {
      colorNumber: {
        0: 'bg-distinct-1 hover:bg-distinct-1 outline-distinct-1',
        1: 'bg-distinct-2 hover:bg-distinct-2 outline-distinct-2',
        2: 'bg-distinct-3 hover:bg-distinct-3 outline-distinct-3',
        3: 'bg-distinct-4 hover:bg-distinct-4 outline-distinct-4',
        4: 'bg-distinct-5 hover:bg-distinct-5 outline-distinct-5',
        5: 'bg-distinct-6 hover:bg-distinct-6 outline-distinct-6',
        6: 'bg-distinct-7 hover:bg-distinct-7 outline-distinct-7',
        7: 'bg-distinct-8 hover:bg-distinct-8 outline-distinct-8',
        8: 'bg-distinct-9 hover:bg-distinct-9 outline-distinct-9',
      },
      isSelected: {
        false: 'opacity-50',
        true: 'outline-2 outline-offset-2  opacity-100',
      },
      opponentSelection: {
        false: 'opacity-100',
        true: 'opacity-50',
      },
    },
  },
)

// dont want to add the types for 1-9, makes it messy to read
function coloredButtonClass(colorNumber: any, isSelected: boolean) {
  return twMerge(clsx(colorVariants({ colorNumber, isSelected })))
}
</script>
