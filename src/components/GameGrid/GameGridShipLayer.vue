<template>
  <GridLayout
    ref="shipGrid"
    v-model:layout="layout"
    :col-num="10"
    :max-rows="10"
    :row-height="rowHeight"
    is-draggable
    :margin="[1, 1]"
    :prevent-collision="false"
    :vertical-compact="false"
    is-bounded
    :use-css-transforms="false"
    :auto-size="false"
    @layout-updated="layoutUpdated">
    <template #item="{ item }">
      <GameGridShip :item="item" :color="color" :disabled="!isDraggable" :size="rowHeight" @turn-element="turnElement(item.i)" />
    </template>
  </GridLayout>
</template>

<script setup lang="ts">
import type { Layout } from 'grid-layout-plus'
import type { Color } from '../../composables/useGame'
import { GridLayout } from 'grid-layout-plus'

const props = defineProps<{
  color: Color | null
  isDraggable: boolean
}>()

const layout = defineModel('layout', {
  required: true,
  type: Array as () => Layout,
})

const shipGrid = useTemplateRef('shipGrid')

function layoutUpdated() {
  // every time a ship goes out of the 10x10 reset its position
  layout.value.forEach((el, index) => {
    // Ensure the ship is within bounds
    if (el.x + el.w > 10) {
      el.x = 10 - el.w
    }
    if (el.y + el.h > 10) {
      el.y = 10 - el.h
    }
    if (el.x < 0) {
      el.x = 0
    }
    if (el.y < 0) {
      el.y = 0
    }

    // Check for overlapping ships

    let hasOverlap = false
    do {
      hasOverlap = false
      for (let i = 0; i < layout.value.length; i++) {
        if (i !== index) {
          const other = layout.value[i]
          const overlapX = el.x < other.x + other.w && el.x + el.w > other.x
          const overlapY = el.y < other.y + other.h && el.y + el.h > other.y
          if (overlapX && overlapY) {
            hasOverlap = true
            el.x += 1 // Try shifting right
            if (el.x + el.w > 10) {
              el.x = 0 // Wrap around to the left
              el.y += 1 // Move down
              if (el.y + el.h > 10) {
                el.y = 0 // Reset to the top
              }
            }
            break
          }
        }
      }
    } while (hasOverlap)
  })
}

function turnElement(id: number | string) {
  const element = layout.value.find(el => el.i === id)
  if (element) {
    // Calculate new top-left position so the center remains unchanged
    const oldW = element.w
    const oldH = element.h
    // New width will be oldH and new height will be oldW.
    // Adjust x and y so that the center stays the same.
    element.x = Math.round(element.x + (oldW - oldH) / 2)
    element.y = Math.round(element.y + (oldH - oldW) / 2)
    element.w = oldH
    element.h = oldW
  }
  layoutUpdated()
}

const rowHeight = ref(0)

useResizeObserver(() => shipGrid.value?.$el, () => {
  const clientHeight = shipGrid.value?.$el.clientHeight || 0
  rowHeight.value = clientHeight / 10 - 1
})

watch(() => props.isDraggable, (newValue) => {
  layout.value.forEach((el) => {
    el.static = !newValue
  })
}, { immediate: true })
</script>

<style lang="css">
.vgl-item {
  transition: none !important;
}
</style>
