<template>
  <div
    class="group relative"
    :style="{ width: `${width}px`, height: `${height}px` }"

    @mousedown.prevent="onDown"
    @mouseup.prevent="onUp"
    @touchstart.prevent="onDown"
    @touchend.prevent="onUp">
    <div :class="shipVariants({ flipped: rotation >= 180 })" class="relative size-full">
      <component :is="shipComponent" :orientation="orientation" class="size-full" :class="shipVariants({ color })" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LayoutItem } from 'grid-layout-plus'
import type { Color } from '../../../composables/useGame'
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

const emit = defineEmits(['turnElement', 'dragStart', 'dragEnd'])

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

const width = computed(() => (orientation.value === 'horizontal' ? length.value * props.size : props.size))
const height = computed(() => (orientation.value === 'vertical' ? length.value * props.size : props.size))

const shipVariants = cva(
  'stroke-4',
  {
    defaultVariants: {
      color: 'blue',
      flipped: false,
    },
    variants: {
      color: {
        blue: 'stroke-distinct-6 fill-distinct-6/40',
        emerald: 'stroke-distinct-4 fill-distinct-4/40',
        green: 'stroke-distinct-3 fill-distinct-3/40',
        indigo: 'stroke-distinct-7 fill-distinct-7/40',
        orange: 'stroke-distinct-1 fill-distinct-1/40',
        rose: 'stroke-distinct-9 fill-distinct-9/40',
        teal: 'stroke-distinct-5 fill-distinct-5/40',
        violet: 'stroke-distinct-8 fill-distinct-8/40',
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
const clickTimeThreshold = 200 // milliseconds
const lastMouseDownTime = ref(0)

function onDown() {
  lastMouseDownTime.value = Date.now()
}

function onUp() {
  const timeDiff = Date.now() - lastMouseDownTime.value
  if (timeDiff < clickTimeThreshold) {
    rotateShip()
  }
}

function rotateShip() {
  emit('turnElement', props.item.i)
  rotation.value = (rotation.value + 90) % 360
}
</script>
