<template>
  <motion.button
    :class="button(props, $attrs.class as string | undefined)"
    :while-press="{ scale: 0.95 }">
    <slot />
  </motion.button>
</template>

<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { motion } from 'motion-v'
import { twMerge } from 'tailwind-merge'

const props = withDefaults(defineProps<{
  type?: 'primary' | 'error' | 'success' | 'muted' | 'ghost' | 'warning'
  size?: 'small' | 'medium' | 'large' | 'huge'
  disabled?: boolean
  square?: boolean
  rounded?: boolean
}>(), {
  type: 'primary',
  size: 'medium',
  disabled: false,
  square: false,
  rounded: false,
})

const buttonVariants = cva('items-center justify-center inline-flex gap-2 whitespace-nowrap rounded-md font-medium cursor-pointer focus-visible:outline-none disabled:pointer-events-none transition-colors duration-200 ease-in-out shadow-md', {
  variants: {
    type: {
      primary: ['bg-base-800 hover:bg-base-900 text-primary focus-visible:ring-primary shadow-primary'],
      success: ['bg-base-800 hover:bg-base-900 text-success focus-visible:ring-success shadow-success'],
      warning: ['bg-base-800 hover:bg-base-900 text-warning focus-visible:ring-warning shadow-warning'],
      error: ['bg-base-800 hover:bg-base-900 text-error focus-visible:ring-error shadow-error'],
      muted: ['bg-base-800 hover:bg-base-900 text-base-300 focus-visible:ring-base-800 shadow-base-800'],
      ghost: ['shadow-none hover:bg-base-200 text-base-900'],
    },
    size: {
      small: ['text-sm focus-visible:ring'],
      medium: ['text-md focus-visible:ring'],
      large: ['text-lg focus-visible:ring-2'],
      huge: ['text-xl focus-visible:ring-2'],
    },
    square: {
      true: ['aspect-square'],
      false: [],
    },
    rounded: {
      true: ['rounded-full'],
      false: ['rounded-md'],
    },
    disabled: {
      false: [],
      true: ['opacity-40 focus-visible:ring-0 pointer-events-none select-none shadow-none'],
    },
  },
  compoundVariants: [
    {
      square: true,
      size: 'small',
      class: ['p-1'],
    },
    {
      square: true,
      size: 'medium',
      class: ['p-1.5'],
    },
    {
      square: true,
      size: 'large',
      class: ['p-3'],
    },
    {
      square: true,
      size: 'huge',
      class: ['p-4'],
    },
    {
      square: false,
      size: 'small',
      class: ['py-1 px-3 '],
    },
    {
      square: false,
      size: 'medium',
      class: ['py-2 px-4'],
    },
    {
      square: false,
      size: 'large',
      class: ['py-2.5 px-6'],
    },
    {
      square: false,
      size: 'huge',
      class: ['py-4 px-8'],
    },
  ],
})

interface ButtonProps extends VariantProps<typeof buttonVariants> {}

function button(variants: ButtonProps, classes: string = '') {
  return twMerge(clsx(buttonVariants(variants), classes))
}
</script>
