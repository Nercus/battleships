<template>
  <div class="relative w-full">
    <textarea v-model="model" :class="textarea(props)" autocomplete="false" />
    <Button class="absolute top-1 right-1" size="small" square type="muted" @click="handleClipboardHelperClick">
      <Icon v-if="copyMode" class="fluent--copy-24-filled" />
      <Icon v-else class="fluent--clipboard-24-filled" />
    </Button>
  </div>
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

const model = defineModel('', {
  type: String,
  default: '',
})

const copyMode = computed(() => {
  return props.copyPasteButton && model.value?.length > 0
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

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    push.success({
      title: 'Copied to clipboard',
      message: 'The text has been copied to your clipboard.',
      duration: 3000,
    })
  })
}

function pasteFromClipboard() {
  navigator.clipboard.readText().then((text) => {
    model.value = text
    push.success({
      title: 'Pasted from clipboard',
      message: 'The text has been pasted from your clipboard.',
      duration: 3000,
    })
  })
}

function handleClipboardHelperClick() {
  if (copyMode.value) {
    copyToClipboard(model.value)
  }
  else {
    pasteFromClipboard()
  }
}
</script>
