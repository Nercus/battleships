<template>
  <RadioGroupRoot v-model="color" class="flex flex-row gap-1 md:gap-2 mb-2">
    <RadioGroupItem v-for="c in AVAILABLE_COLORS" :key="c" :value="c" as-child>
      <CommonButton size="icon" class="relative w-8" :class="radioItemVariant({ color: c })" :disabled="c === opponentColor">
        <Icon v-if="opponentColor === c" class="text-error fluent--presence-blocked-20-regular" />
        <RadioGroupIndicator>
          <Icon class="absolute inset-0 bg-base-100 size-full fluent--checkmark-12-filled" />
        </RadioGroupIndicator>
      </CommonButton>
    </RadioGroupItem>
  </RadioGroupRoot>
</template>

<script setup lang="ts">
import type { Color } from '../../composables/useGame'
import { cva } from 'class-variance-authority'
import { AVAILABLE_COLORS } from '../../composables/useGame'

const { onEvent, sendEvent } = useEvent()
const { opponentColor } = useGame()

const color = defineModel<Color | null>()

const radioItemVariant = cva('', {
  variants: {
    color: {
      blue: 'bg-distinct-6/70 hover:bg-distinct-6 outline-distinct-6',
      emerald: 'bg-distinct-4/70 hover:bg-distinct-4 outline-distinct-4',
      green: 'bg-distinct-3/70 hover:bg-distinct-3 outline-distinct-3',
      indigo: 'bg-distinct-7/70 hover:bg-distinct-7 outline-distinct-7',
      orange: 'bg-distinct-1/70 hover:bg-distinct-1 outline-distinct-1',
      rose: 'bg-distinct-9/70 hover:bg-distinct-9 outline-distinct-9',
      teal: 'bg-distinct-5/70 hover:bg-distinct-5 outline-distinct-5',
      violet: 'bg-distinct-8/70 hover:bg-distinct-8 outline-distinct-8',
    },
  },
})

watch(color, (newColor) => {
  if (newColor) {
    sendEvent({ data: newColor, type: 'color' })
  }
})

let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'color') {
      opponentColor.value = event.data
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
})
</script>
