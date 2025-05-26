<template>
  <div class="place-items-center grid grid-cols-10 grid-rows-10 aspect-square">
    <h1
      class="-top-10 left-2 absolute w-full font-semibold text-xl text-center select-none height-6">
      {{ props.title }}
    </h1>
    <GameGridLabels vertical />
    <GameGridLabels horizontal />
    <GameGridHitIndicator
      v-for="(hitType, index) in flatBoard"
      :key="index"
      class="w-[80%] h-[80%]"
      :type="hitType"
      :board-title="props.title"
      :index="index"
      :board-type="boardType"
      @click="setTarget(hitType, index)"
      @dblclick="onDoubleClick(hitType, index)" />
  </div>
</template>

<script setup lang="ts">
import type { Board, HitType } from '../../composables/useGame'

const props = defineProps<{
  board: Board
  title: string
  boardType?: 'opponent' | 'player'
}>()
const emit = defineEmits<{
  (e: 'shoot', x: number, y: number): void
}>()
const { playerTarget } = useGame()
const { sendEvent } = useConnection()

const flatBoard = computed(() => {
  return props.board.flat()
})

function setTarget(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  const x = Math.floor(index / 10)
  const y = index % 10
  playerTarget.value = { x, y }
  sendEvent({ data: { x, y }, type: 'target' })
}

function onDoubleClick(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  if (!playerTarget.value) return
  const x = Math.floor(index / 10)
  const y = index % 10
  if (playerTarget.value.x !== x || playerTarget.value.y !== y) return
  emit('shoot', x, y)
}
</script>
