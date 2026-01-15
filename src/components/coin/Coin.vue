<template>
  <div class="relative w-80 md:w-3/4 max-w-full h-80 md:h-3/4 max-h-full aspect-square">
    <TresCanvas clear-color="#f5f5f5" class="size-full">
      <Suspense>
        <CoinScene :colors="resolvedColors" :names="props.names" :target-side="props.targetSide" />
        <template #fallback>
          Loading coin...
        </template>
      </Suspense>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

const props = defineProps<{
  colors: [string, string]
  names: [string, string]
  targetSide: 0 | 1
}>()

const colorValues = computed(() => ({
  blue: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-6').trim(),
  emerald: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-4').trim(),
  green: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-3').trim(),
  indigo: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-7').trim(),
  orange: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-1').trim(),
  rose: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-9').trim(),
  teal: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-5').trim(),
  violet: getComputedStyle(document.documentElement).getPropertyValue('--color-distinct-8').trim(),
}))

const resolvedColors = computed<[string, string]>(() => {
  return [
    colorValues.value[props.colors[0] as keyof typeof colorValues.value] || props.colors[0],
    colorValues.value[props.colors[1] as keyof typeof colorValues.value] || props.colors[1],
  ]
})
</script>
