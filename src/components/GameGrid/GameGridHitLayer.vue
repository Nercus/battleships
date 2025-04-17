<template>
  <div class="aspect-square grid-cols-10 grid grid-rows-10 place-items-center ">
    <h1 class="absolute -top-10 height-6 w-full text-center font-semibold left-2 text-xl">
      {{ props.title }}
    </h1>
    <GameGridLabels vertical />
    <GameGridLabels horizontal />
    <GameGridHitIndicator v-for="(hitType, index) in flatBoard" :key="index" :type="hitType" :board-title="props.title" :index="index" :board-type="boardType" @click="setTarget(hitType, index)" @dblclick="onDoubleClick(hitType, index)" />
  </div>
</template>

<script setup lang="ts">
import type { Board, HitType } from '../../store/useGameStore'

const props = defineProps<{
  board: Board
  title: string
  boardType?: 'opponent' | 'player'
}>()

const emit = defineEmits<{
  (e: 'shoot', x: number, y: number): void
}>()

const { sendEvent } = useConnectionStore()
const { target } = storeToRefs(useGameStore())

const flatBoard = computed(() => {
  return props.board.flat()
})

function setTarget(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  const x = Math.floor(index / 10)
  const y = index % 10
  target.value = { x, y }
  sendEvent({ type: 'target', data: { x, y } })
}

function onDoubleClick(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  if (!target.value) return
  const x = Math.floor(index / 10)
  const y = index % 10
  if (target.value.x !== x || target.value.y !== y) return
  emit('shoot', x, y)
}
</script>
