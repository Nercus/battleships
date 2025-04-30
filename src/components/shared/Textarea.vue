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
}>(), {
  size: 'medium',
  variant: 'default',
})

const model = defineModel({
  default: '',
  type: String,
})

const textareaVariants = cva('flex disabled:opacity-50 px-3 py-2 border border-base-800 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-900 ring-offset-2 focus-visible:ring-offset-2 w-full min-h-20 placeholder:text-muted-base-900 text-sm resize-none disabled:cursor-not-allowed', {
  defaultVariants: {
    size: 'medium',
    variant: 'default',
  },
  variants: {
    size: {
      huge: 'h-16 text-xl',
      large: 'h-12 text-lg',
      medium: 'h-10 text-md',
      small: 'h-8 text-sm',
    },
    variant: {
      default: 'border-input focus-visible:ring-ring',
      error: 'border-error focus-visible:ring-error',
      success: 'border-success focus-visible:ring-success',
      warning: 'border-warning focus-visible:ring-warning',
    },
  },
})

interface TextareaProps extends VariantProps<typeof textareaVariants> {}

function textarea(variants: TextareaProps) {
  return twMerge(clsx(textareaVariants(variants)))
}
</script>
