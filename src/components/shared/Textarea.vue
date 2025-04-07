<template>
    <textarea v-model="model" :class="textarea(props)" autocomplete="false" />
</template>

<script setup lang="ts">
import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

const props = withDefaults(defineProps<{
  variant?: 'default' | 'error' | 'success' | 'warning'
  size?: 'small' | 'medium' | 'large' | 'huge'
  copyPasteButton?: boolean
}>(), {
  variant: 'default',
  size: 'medium',
  copyPasteButton: true,
})

const model = defineModel({
  type: String,
  default: '',
})

const textareaVariants = cva('resize-none flex min-h-20 w-full rounded-md border border-base-800 px-3 py-2 text-sm ring-offset-2 placeholder:text-muted-base-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50', {
  variants: {
    variant: {
      default: 'border-input focus-visible:ring-ring',
      error: 'border-error focus-visible:ring-error',
      success: 'border-success focus-visible:ring-success',
      warning: 'border-warning focus-visible:ring-warning',
    },
    size: {
      small: 'h-8 text-sm',
      medium: 'h-10 text-md',
      large: 'h-12 text-lg',
      huge: 'h-16 text-xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'medium',
  },
})

interface TextareaProps extends VariantProps<typeof textareaVariants> {}

function textarea(variants: TextareaProps) {
  return twMerge(clsx(textareaVariants(variants)))
}
</script>
