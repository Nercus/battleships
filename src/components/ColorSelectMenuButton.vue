<template>
  <Button type="primary" square size="huge" :class="[coloredButtonClass(colorNumber, isSelected), isSelected ? '' : '']" :disabled="isOpponentSelected">
    <div v-if="isOpponentSelected" class="relative flex items-center justify-center w-full h-full bg-base-100 rounded-full">
      <Icon class="fluent--presence-blocked-20-regular bg-error" />
    </div>
    <Icon v-else-if="isSelected" class="fluent--checkmark-12-filled bg-base-100 size-full" />
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
  'size-14',
  {
    defaultVariants: {
      colorNumber: 1,
    },
    variants: {
      colorNumber: {
        0: 'bg-distinct-1 hover:bg-distinct-1',
        1: 'bg-distinct-2 hover:bg-distinct-2',
        2: 'bg-distinct-3 hover:bg-distinct-3',
        3: 'bg-distinct-4 hover:bg-distinct-4',
        4: 'bg-distinct-5 hover:bg-distinct-5',
        5: 'bg-distinct-6 hover:bg-distinct-6',
        6: 'bg-distinct-7 hover:bg-distinct-7',
        7: 'bg-distinct-8 hover:bg-distinct-8',
        8: 'bg-distinct-9 hover:bg-distinct-9',
      },
      isSelected: {
        false: 'opacity-50',
        true: 'outline-2 outline-offset-2 outline-primary opacity-100',
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
