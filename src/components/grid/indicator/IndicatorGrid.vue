<template>
  <div class="grid grid-cols-10 grid-rows-10">
    <IndicatorGridCell
      v-for="(hitType, index) in flatBoard" :key="index" :index="index"
      :type="hitType" :board-type="props.boardType" :disabled="isDisabled" @click="setTarget(hitType, index)" @dblclick.stop="onDoubleClick(hitType, index)" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  board?: Board
  boardType?: 'opponent' | 'player'
}>()
const emit = defineEmits<{
  (e: 'shoot', x: number, y: number): void
}>()
const { playerTarget, playersTurn } = useGame()
const { sendEvent } = useEvent()

const isDisabled = computed(() => {
  return !props.board || !(props.boardType === 'opponent' && playersTurn.value)
})

const flatBoard = computed(() => {
  return props.board?.flat() || Array.from({ length: 100 }).fill('none') as HitType[]
})

function onDoubleClick(hitType: HitType, index: number) {
  if (hitType !== 'none') return
  if (!playerTarget.value) return
  const x = Math.floor(index / 10)
  const y = index % 10
  if (playerTarget.value.x !== x || playerTarget.value.y !== y) return
  emit('shoot', x, y)
}

function setTarget(hitType: HitType, index: number) {
  if (hitType !== 'none') return

  const x = Math.floor(index / 10)
  const y = index % 10

  playerTarget.value = { x, y }
  sendEvent({ data: { x, y }, type: 'target' })
}
</script>
