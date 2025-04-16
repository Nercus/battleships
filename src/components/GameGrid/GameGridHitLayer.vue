<template>
  <div class="aspect-square grid-cols-10 grid grid-rows-10 place-items-center ">
    <h1 class="absolute -top-6 height-6 font-semibold left-2">
      {{ props.title }}
    </h1>
    <GameGridHitIndicator v-for="(hitType, index) in flatBoard" :key="index" :type="hitType" :board-title="props.title" :index="index" @click="setTarget(hitType, index)" @dblclick="onDoubleClick(hitType, index)" />
  </div>
</template>

<script setup lang="ts">
import type { Board, HitType } from '../../store/useGameStore'

const props = defineProps<{
  board: Board
  title: string
}>()

const emit = defineEmits<{
  (e: 'shoot', x: number, y: number): void
}>()

const { target } = storeToRefs(useGameStore())

const flatBoard = computed(() => {
  return props.board.flat()
})

function setTarget(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  target.value = `${props.title}-${index}`
}

function onDoubleClick(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  if (!target.value) return
  if (target.value !== `${props.title}-${index}`) return
  // split index into x and y
  const x = Math.floor(index / 10)
  const y = index % 10
  emit('shoot', x, y)
}
</script>
