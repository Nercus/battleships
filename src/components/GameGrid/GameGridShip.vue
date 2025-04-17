<template>
  <div class="w-full h-full p-1 group">
    <div
      class="w-full  backdrop-blur-sm border-2  h-full flex items-center justify-center shadow " :class="[props.item.w === 1 ? 'ship-border-vertical' : 'ship-border-horizontal', isHost ? 'bg-warning/70 border-warning/5 group-hover:border-warning' : 'bg-success/70 border-success/5 group-hover:border-success']">
      <Button v-if="gameState === 'setup'" type="ghost" size="small" square @click="emit('turnElement', props.item.i)">
        <Icon class="fluent--arrow-rotate-clockwise-16-filled " />
      </Button>
      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['turnElement'])
const { isHost } = storeToRefs(useConnectionStore())
const { gameState } = storeToRefs(useGameStore())
</script>
