<template>
  <div class="flex flex-row flex-wrap justify-center gap-2">
    <ColorSelectMenuButton v-for="(colorname, i) in AVAILABLE_COLORS" :key="colorname" :color-number="i" :is-selected="colorname === playerColor" :is-opponent-selected="colorname === opponentColor" @click="selectColor(colorname)" />
  </div>
</template>

<script setup lang="ts">
import type { Color } from '../composables/useGame'
import { AVAILABLE_COLORS } from '../composables/useGame'

const { opponentColor, playerColor } = useGame()
const { onEvent, sendEvent } = useEvent()

function selectColor(name: Color) {
  playerColor.value = name
  sendEvent({ data: name, type: 'color' })
}

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
