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
  variant?: 'primary' | 'error' | 'success' | 'muted' | 'warning'
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'icon'
  disabled?: boolean
}>(), {
  disabled: false,
  size: 'medium',
  variant: 'primary',
})

const buttonVariants = cva(
  'inline-flex justify-center items-center gap-2 disabled:opacity-50 shadow-shadow hover:shadow-none border-2 border-black rounded-rounded focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black ring-offset-white focus-visible:ring-offset-2 [&_svg]:size-4 font-base text-sm whitespace-nowrap transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY cursor-pointer [&_svg]:pointer-events-none disabled:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        error: ['bg-error'],
        muted: ['bg-base-200'],
        primary: ['bg-primary'],
        success: ['bg-success'],
        warning: ['bg-warning'],
      },
      size: {
        tiny: 'h-6 px-2',
        small: 'h-8 px-3',
        medium: 'h-10 px-4 py-2',
        large: 'h-11 px-8',
        icon: 'aspect-square',
      },
      disabled: {
        false: [],
        true: ['opacity-40 focus-visible:ring-0 pointer-events-none select-none '],
      },
    },
  },
)

interface ButtonProps extends VariantProps<typeof buttonVariants> { }

function button(variants: ButtonProps, classes: string = '') {
  return twMerge(clsx(buttonVariants(variants), classes))
}
</script>
