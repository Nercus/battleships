<template>
  <div class="w-full h-full p-1 group">
    <div class="w-full bg-primary/70 backdrop-blur-sm border-2 border-primary/5 h-full flex items-center justify-center shadow group-hover:border-primary" :class="props.item.w === 1 ? 'ship-border-vertical' : 'ship-border-horizontal'">
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

const { gameState } = useGame()
</script>
