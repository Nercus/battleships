<template>
  <div
    v-if="props.type !== 'none'"
    class="w-[80%] h-[80%] aspect-square p-1 rounded-full shadow-[0px_2px_3px_2px_rgba(0,_0,_0,_0.6)] flex items-center justify-center"
    :class="{
      'bg-base-300': props.type === 'miss',
      'bg-error': props.type === 'hit',
    }">
    <div class="w-2/3 h-2/3 bg-black/10 rounded-full shadow-[inset_0px_0px_5px_3px_rgba(0,_0,_0,_0.4)]" />
  </div>
  <Button v-else class="cursor-pointer w-[80%] h-[80%] ring-error p-0" :class="{ 'ring-2 bg-error/10': isTarget }" square type="ghost" :disabled="!myTurn">
    <Icon v-if="isTarget" class="fluent--location-target-square-20-regular size-full bg-error" />
  </Button>
</template>

<script setup lang="ts">
import type { HitType } from '../../store/useGameStore'

const props = defineProps<{
  type: HitType
  boardTitle: string
  index: number
}>()

const { myTurn, target } = storeToRefs(useGameStore())

const isTarget = computed(() => {
  return target.value === `${props.boardTitle}-${props.index}`
})
</script>
