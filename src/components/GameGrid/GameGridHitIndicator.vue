<template>
  <div
    v-if="props.type !== 'none'"
    class="flex justify-center items-center indicator-outer-shadow mt-1 p-1 rounded-full aspect-square"
    :class="{
      'bg-base-300': props.type === 'miss',
      'bg-error': props.type === 'hit',
      'bg-blue': opponentTarget !== null,
      'animate-pulse': flashTarget && isAttackTarget,
    }">
    <div class="bg-black/10 indicator-inner-shadow rounded-full size-4/5 md:size-2/3" />
  </div>
  <Button v-else-if="playersTurn && isOpponentsBoard" class="p-0 ring-error cursor-pointer" :class="{ 'ring-2 bg-error/10 rounded-full indicator-outer-shadow': isPlayersTarget }" square type="ghost">
    <Icon v-if="isPlayersTarget" class="bg-error size-full fluent--location-target-square-20-regular" />
  </Button>
  <div v-else class="animate-pulse" :class="{ 'rounded-full indicator-outer-shadow': opponentTarget?.x === x && opponentTarget?.y === y && isPlayerBoardHitStates }">
    <Icon v-if="opponentTarget?.x === x && opponentTarget?.y === y && isPlayerBoardHitStates" class="bg-error rounded-full ring-2 ring-error size-full fluent--target-20-filled" />
  </div>
</template>

<script setup lang="ts">
import type { HitType } from '../../composables/useGame'

const props = defineProps<{
  type: HitType
  boardType?: 'opponent' | 'player'
  index: number
}>()

const { onEvent } = useEvent()
const { opponentTarget, playersTurn, playerTarget } = useGame()

const x = computed(() => {
  return Math.floor(props.index / 10)
})
const y = computed(() => {
  return props.index % 10
})

const isOpponentsBoard = computed(() => {
  return props.boardType === 'opponent'
})

const isPlayerBoardHitStates = computed(() => {
  return props.boardType === 'player'
})

const isPlayersTarget = computed(() => {
  return playerTarget.value?.x === x.value && playerTarget.value?.y === y.value
})

const attackTarget = ref<null | { x: number, y: number }>(null)
const isAttackTarget = computed(() => {
  return attackTarget.value?.x === x.value && attackTarget.value?.y === y.value
})
const flashTarget = ref(false)

onEvent((event) => {
  if (event.type === 'attack') {
    attackTarget.value = event.data
    flashTarget.value = true
    setTimeout(() => {
      flashTarget.value = false
    }, 1000)
  }
})
</script>

<style lang="css">
 .indicator-inner-shadow {
  box-shadow: inset 0px 0px 5px 3px rgba(0, 0, 0, 0.4);
}

.indicator-outer-shadow {
  box-shadow: 0px 2px 3px 2px rgba(0, 0, 0, 0.4);
}

@media (width <= 48rem) {
  .indicator-inner-shadow {
    box-shadow: inset 0px 0px 3px 2px rgba(0, 0, 0, 0.35);
  }

  .indicator-outer-shadow {
    box-shadow: 0px 1px 1px 1px rgba(0, 0, 0, 0.35);
  }
}
</style>
