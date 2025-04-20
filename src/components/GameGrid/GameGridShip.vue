<template>
  <div class="w-full h-full p-1 group relative">
    <div :class="shipVariants({ flipped: rotation >= 180, orientation: props.item.w === 1 ? 'vertical' : 'horizontal', color })">
      <Button v-if="!disabled" type="ghost" size="small" square @click="emit('turnElement', props.item.i); setRotation()">
        <Icon class="fluent--arrow-rotate-clockwise-16-filled " />
      </Button>
      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LayoutItem } from 'grid-layout-plus'
import type { Color } from '../../composables/useGame'
import { cva } from 'class-variance-authority'

const props = defineProps<{
  item: LayoutItem
  color: Color | null
  disabled: boolean
}>()

const emit = defineEmits(['turnElement'])

const shipVariants = cva(
  'w-full backdrop-blur-sm border-2 h-full flex items-center justify-center shadow',
  {
    defaultVariants: {
      color: 'blue',
      flipped: false,
      orientation: props.item.w === 1 ? 'vertical' : 'horizontal',
    },
    variants: {
      color: {
        blue: 'bg-distinct-6 hover:bg-distinct-6',
        emerald: 'bg-distinct-4 hover:bg-distinct-4',
        green: 'bg-distinct-3 hover:bg-distinct-3',
        indigo: 'bg-distinct-7 hover:bg-distinct-7',
        orange: 'bg-distinct-1 hover:bg-distinct-1',
        rose: 'bg-distinct-9 hover:bg-distinct-9',
        teal: 'bg-distinct-5 hover:bg-distinct-5',
        violet: 'bg-distinct-8 hover:bg-distinct-8',
        yellow: 'bg-distinct-2 hover:bg-distinct-2',
      },
      flipped: {
        false: 'rotate-0',
        true: 'rotate-180',
      },
      orientation: {
        horizontal: 'ship-border-horizontal',
        vertical: 'ship-border-vertical',
      },
    },
  },
)

const rawRotation = ref(0)
const rotation = refDefault(rawRotation, props.item.w === 1 ? 0 : 90)

function setRotation() {
  rotation.value = (rotation.value + 90) % 360
}
</script>

<style lang="css">
.ship-border-vertical {
  border-radius: 53% 47% 38% 39% / 85% 88% 10% 10%;
}
.ship-border-horizontal {
  border-radius: 95% 11% 12% 83% / 49% 43% 55% 51%;
}
</style>
