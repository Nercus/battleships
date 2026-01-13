<template>
  <div class="group relative" :style="{ width: `${width}px`, height: `${height}px` }">
    <div :class="shipVariants({ flipped: rotation >= 180 })" class="relative md:py-1 size-full">
      <component :is="shipComponent" :orientation="orientation" class="size-full" :class="shipVariants({ color })" />
    </div>
    <Button v-if="!disabled" type="muted" size="small" square class="md:invisible group-hover:visible absolute inset-0 m-auto size-3 md:size-4 hover:scale-150" @click="emit('turnElement', props.item.i); setRotation()">
      <Icon class="size-3 md:size-4 fluent--arrow-rotate-clockwise-16-filled" />
    </Button>
  </div>
</template>

<script setup lang="ts">
import type { LayoutItem } from 'grid-layout-plus'
import type { Color } from '../../composables/useGame'
import { cva } from 'class-variance-authority'

import AircraftCarrier from './ships/AircraftCarrier.vue'
import Battleship from './ships/Battleship.vue'
import Destroyer from './ships/Destroyer.vue'
import Gunship from './ships/Gunship.vue'

const props = defineProps<{
  item: LayoutItem
  color: Color | null
  disabled: boolean
  size: number
}>()

const emit = defineEmits(['turnElement'])

const shipsMap = {
  5: AircraftCarrier,
  4: Battleship,
  3: Destroyer,
  2: Gunship,
} as const

const orientation = computed(() => props.item.w === 1 ? 'vertical' : 'horizontal')
const length = computed(() => props.item.w === 1 ? props.item.h : props.item.w)

const shipComponent = computed(() => {
  return shipsMap[length.value as keyof typeof shipsMap]
})

const width = computed(() => (orientation.value === 'horizontal' ? length.value * props.size + 1 : props.size + 1))
const height = computed(() => (orientation.value === 'vertical' ? length.value * props.size + 1 : props.size + 1))

const shipVariants = cva(
  '',
  {
    defaultVariants: {
      color: 'blue',
      flipped: false,
    },
    variants: {
      color: {
        blue: 'stroke-distinct-6',
        emerald: 'stroke-distinct-4',
        green: 'stroke-distinct-3',
        indigo: 'stroke-distinct-7',
        orange: 'stroke-distinct-1',
        rose: 'stroke-distinct-9',
        teal: 'stroke-distinct-5',
        violet: 'stroke-distinct-8',
      },
      flipped: {
        false: 'rotate-0',
        true: 'rotate-180',
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
