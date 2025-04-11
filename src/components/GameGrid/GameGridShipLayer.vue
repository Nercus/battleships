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
    is-bounded
    :auto-size="false"
    @layout-updated="layoutUpdated">
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
const { gameState, shipsConfirmed, setShipLayout } = useGame()

const layout = ref([
  { x: 0, y: 0, w: 1, h: 3, i: '0', static: false, isResizable: false },
  { x: 8, y: 4, w: 1, h: 4, i: '1', static: false, isResizable: false },
  { x: 1, y: 0, w: 1, h: 2, i: '2', static: false, isResizable: false },
  { x: 3, y: 0, w: 1, h: 2, i: '3', static: false, isResizable: false },
  { x: 5, y: 0, w: 1, h: 3, i: '4', static: false, isResizable: false },
])

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
    const oldWidth = element.w
    const oldHeight = element.h
    element.w = oldHeight
    element.h = oldWidth
  }
  layoutUpdated()
}

function getRowHeight() {
  // get height of shipGrid and return it divided by 10
  const height = shipGrid.value?.$el.clientHeight || 0
  const rowHeight = height / 10
  return rowHeight - 1
}

watchEffect(() => {
  if (gameState.value === 'setup' && !shipsConfirmed.value) {
    layout.value.forEach((el) => {
      el.static = false
    })
  }
  else {
    layout.value.forEach((el) => {
      el.static = true
    })
  }
})

watchEffect(() => {
  if (!shipsConfirmed.value) return
  // convert the layout to a 2d array with 10 rows and 10 columns and true for cells that are occupied by a ship
  const grid = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill(false)) as boolean[][]
  layout.value.forEach((el) => {
    for (let i = el.x; i < el.x + el.w; i++) {
      for (let j = el.y; j < el.y + el.h; j++) {
        grid[j][i] = true
      }
    }
  })
  setShipLayout(grid)
})
</script>

<style lang="css">
.ship-border-vertical {
  border-radius: 53% 47% 38% 39% / 85% 88% 10% 10%;
}
.ship-border-horizontal {
  border-radius:  95% 11% 12% 83% / 49% 43% 55% 51%;
}
</style>
