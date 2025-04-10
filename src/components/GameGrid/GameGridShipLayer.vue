<template>
  <GridLayout
    ref="shipGrid"
    v-model:layout="layout"
    :col-num="10"
    :max-rows="10"
    :row-height="getRowHeight()"
    is-draggable
    :margin="[1, 1]"
    :prevent-collision="false"
    :vertical-compact="false"
    use-css-transforms
    :auto-size="false">
    <template #item="{ item }">
      <div class="w-full h-full p-1 group">
        <div class="w-full bg-primary/70 backdrop-blur-sm border-2 border-primary/5 h-full flex items-center justify-center shadow group-hover:border-primary" :class="item.w === 1 ? 'ship-border-vertical' : 'ship-border-horizontal'">
          <Button type="ghost" size="small" square @click="turnElement(item.i)">
            <Icon class="fluent--arrow-rotate-clockwise-16-filled " />
          </Button>
          <div />
        </div>
      </div>
    </template>
  </GridLayout>
</template>

<script setup lang="ts">
import { GridLayout } from 'grid-layout-plus'

const shipGrid = useTemplateRef('shipGrid')

const layout = ref([
  { x: 0, y: 0, w: 1, h: 3, i: '0', static: false, isResizable: false },
  { x: 8, y: 4, w: 1, h: 4, i: '1', static: false, isResizable: false },
  { x: 1, y: 0, w: 1, h: 2, i: '2', static: false, isResizable: false },
  { x: 3, y: 0, w: 1, h: 2, i: '3', static: false, isResizable: false },
  { x: 5, y: 0, w: 1, h: 3, i: '4', static: false, isResizable: false },
])

function turnElement(id: number | string) {
  const element = layout.value.find(el => el.i === id)
  if (element) {
    const oldWidth = element.w
    const oldHeight = element.h
    element.w = oldHeight
    element.h = oldWidth
  }
}

function getRowHeight() {
  // get height of shipGrid and return it divided by 10
  const height = shipGrid.value?.$el.clientHeight || 0
  const rowHeight = height / 10
  return rowHeight - 1
}
</script>

<style lang="css">
.ship-border-vertical {
  border-radius: 53% 47% 38% 39% / 85% 88% 10% 10%;
}
.ship-border-horizontal {
  border-radius:  95% 11% 12% 83% / 49% 43% 55% 51%;
}
</style>
