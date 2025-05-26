<template>
  <button :class="button(props, $attrs.class as string | undefined)">
    <slot />
  </button>
</template>

<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const props = withDefaults(defineProps<{
  type?: 'primary' | 'error' | 'success' | 'muted' | 'ghost' | 'warning'
  size?: 'small' | 'medium' | 'large' | 'huge'
  disabled?: boolean
  square?: boolean
  rounded?: boolean
}>(), {
  disabled: false,
  rounded: false,
  size: 'medium',
  square: false,
  type: 'primary',
})

const buttonVariants = cva('inline-flex justify-center items-center gap-2 shadow-md rounded-md focus-visible:outline-none font-medium whitespace-nowrap transition-all active:translate-y-1 duration-150 ease-in-out cursor-pointer disabled:pointer-events-none transform', {
  compoundVariants: [
    {
      class: ['p-1'],
      size: 'small',
      square: true,
    },
    {
      class: ['p-1.5'],
      size: 'medium',
      square: true,
    },
    {
      class: ['p-3'],
      size: 'large',
      square: true,
    },
    {
      class: ['p-4'],
      size: 'huge',
      square: true,
    },
    {
      class: ['py-1 px-3 '],
      size: 'small',
      square: false,
    },
    {
      class: ['py-2 px-4'],
      size: 'medium',
      square: false,
    },
    {
      class: ['py-2.5 px-6'],
      size: 'large',
      square: false,
    },
    {
      class: ['py-4 px-8'],
      size: 'huge',
      square: false,
    },
  ],
  variants: {
    disabled: {
      false: [],
      true: ['opacity-40 focus-visible:ring-0 pointer-events-none select-none shadow-none'],
    },
    rounded: {
      false: ['rounded-md'],
      true: ['rounded-full'],
    },
    size: {
      huge: ['text-xl focus-visible:ring-2'],
      large: ['text-lg focus-visible:ring-2'],
      medium: ['text-md focus-visible:ring'],
      small: ['text-sm focus-visible:ring'],
    },
    square: {
      false: [],
      true: ['aspect-square'],
    },
    type: {
      error: ['bg-base-800 hover:bg-base-900 text-error focus-visible:ring-error shadow-error'],
      ghost: ['shadow-none hover:bg-base-200 text-base-900'],
      muted: ['bg-base-800 hover:bg-base-900 text-base-300 focus-visible:ring-base-800 shadow-base-800'],
      primary: ['bg-base-800 hover:bg-base-900 text-primary focus-visible:ring-primary shadow-primary'],
      success: ['bg-base-800 hover:bg-base-900 text-success focus-visible:ring-success shadow-success'],
      warning: ['bg-base-800 hover:bg-base-900 text-warning focus-visible:ring-warning shadow-warning'],
    },
  },
})

interface ButtonProps extends VariantProps<typeof buttonVariants> {}

function button(variants: ButtonProps, classes: string = '') {
  return twMerge(clsx(buttonVariants(variants), classes))
}
</script>
