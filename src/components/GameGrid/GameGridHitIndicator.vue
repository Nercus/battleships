<template>
  <div
    v-if="props.type !== 'none'"
    class="w-[80%] h-[80%] aspect-square p-1 rounded-full shadow-[0px_2px_3px_2px_rgba(0,_0,_0,_0.6)] flex items-center justify-center"
    :class="{
      'bg-base-300': props.type === 'miss',
      'bg-error': props.type === 'hit',
      'bg-blue': enemyTarget !== null,
      'animate-pulse': flashTarget && isAttackTarget,
    }">
    <div class="w-2/3 h-2/3 bg-black/10 rounded-full shadow-[inset_0px_0px_5px_3px_rgba(0,_0,_0,_0.4)]" />
  </div>
  <Button v-else-if="myTurn && isOpponentsBoard" class="cursor-pointer w-[80%] h-[80%] ring-error p-0" :class="{ 'ring-2 bg-error/10 rounded-full shadow-[0px_2px_3px_2px_rgba(0,_0,_0,_0.6)]': isTarget }" square type="ghost">
    <Icon v-if="isTarget" class="fluent--location-target-square-20-regular size-full bg-error" />
  </Button>
  <div v-else class="w-[80%] h-[80%] animate-pulse" :class="{ 'rounded-full shadow-[0px_2px_3px_2px_rgba(0,_0,_0,_0.6)]': enemyTarget?.x === x && enemyTarget?.y === y && isPlayerBoard }">
    <Icon v-if="enemyTarget?.x === x && enemyTarget?.y === y && isPlayerBoard" class="fluent--target-20-filled size-full bg-error rounded-full ring-2 ring-error" />
  </div>
</template>

<script setup lang="ts">
import type { HitType } from '../../store/useGameStore'

const props = defineProps<{
  type: HitType
  boardTitle: string
  boardType?: 'opponent' | 'player'
  index: number
}>()

const { myTurn, target, enemyTarget } = storeToRefs(useGameStore())
const { onEventReceive } = useConnectionStore()

const x = computed(() => {
  return Math.floor(props.index / 10)
})
const y = computed(() => {
  return props.index % 10
})

const isOpponentsBoard = computed(() => {
  return props.boardType === 'opponent'
})

const isPlayerBoard = computed(() => {
  return props.boardType === 'player'
})

const isTarget = computed(() => {
  return target.value?.x === x.value && target.value?.y === y.value
})

const attackTarget = ref<null | { x: number, y: number }>(null)
const isAttackTarget = computed(() => {
  return attackTarget.value?.x === x.value && attackTarget.value?.y === y.value
})
const flashTarget = ref(false)

onEventReceive((event) => {
  if (event.type === 'attack') {
    attackTarget.value = event.data
    flashTarget.value = true
    setTimeout(() => {
      flashTarget.value = false
    }, 1000)
  }
})
// TODO: show highlight where the player was attacked
</script>
