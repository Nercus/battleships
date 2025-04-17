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
    is-bounded
    :use-css-transforms="false"
    :auto-size="false"
    @layout-updated="layoutUpdated">
    <template #item="{ item }">
      <GameGridShip :item="item" @turn-element="turnElement(item.i)" />
    </template>
  </GridLayout>
</template>

<script setup lang="ts">
import type { Layout } from 'grid-layout-plus'
import { GridLayout } from 'grid-layout-plus'

const shipGrid = useTemplateRef('shipGrid')
const gameStore = useGameStore()
const { gameState, shipsConfirmed } = storeToRefs(gameStore)

const layout = ref<Layout>([])

const AVAILABLE_SHIPS = [
  { name: 'Carrier', size: 5 },
  { name: 'Battleship', size: 4 },
  { name: 'Cruiser', size: 3 },
  { name: 'Submarine', size: 3 },
  { name: 'Destroyer', size: 2 },
]

function isOverlapping(layout: Layout, x: number, y: number, w: number, h: number) {
  for (const el of layout) {
    if (el.x < x + w && el.x + el.w > x && el.y < y + h && el.y + el.h > y) {
      return true
    }
  }
  return false
}

function initRandomLayout() {
  const newLayout = [] as Layout

  // Randomly place ships on the grid
  for (const ship of AVAILABLE_SHIPS) {
    let placed = false
    while (!placed) {
      const x = Math.floor(Math.random() * 10)
      const y = Math.floor(Math.random() * 10)
      const isHorizontal = Math.random() < 0.5
      const w = isHorizontal ? ship.size : 1
      const h = isHorizontal ? 1 : ship.size

      // Check if the ship fits in the grid and doesn't overlap with existing ships
      if (x + w <= 10 && y + h <= 10 && !isOverlapping(newLayout, x, y, w, h)) {
        newLayout.push({ x, y, w, h, i: ship.name, static: false, isResizable: false })
        placed = true
      }
    }
  }

  layout.value = newLayout as Layout
}

onMounted(() => {
  // Initialize the layout with random ship positions
  initRandomLayout()
})

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
  gameStore.setShipLayout(grid)
})
</script>

<style lang="css">
.vgl-item {
  transition: none !important;
}
</style>
