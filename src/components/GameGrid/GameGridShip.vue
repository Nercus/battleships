<template>
  <div class="w-full h-full p-1 group">
    <div
      class="w-full  backdrop-blur-sm border-2  h-full flex items-center justify-center shadow " :class="[props.item.w === 1 ? 'ship-border-vertical' : 'ship-border-horizontal', isHost ? 'bg-warning/70 border-warning/5 group-hover:border-warning' : 'bg-success/70 border-success/5 group-hover:border-success', rotation >= 180 ? 'rotate-180' : '']">
      <Button v-if="gameState === 'setup'" type="ghost" size="small" square @click="emit('turnElement', props.item.i); setRotation()">
        <Icon class="fluent--arrow-rotate-clockwise-16-filled " />
      </Button>
      <div />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  item: {
    required: true,
    type: Object,
  },
})
const emit = defineEmits(['turnElement'])
const { isHost } = storeToRefs(useConnectionStore())
const { gameState } = storeToRefs(useGameStore())
const rawRotation = ref(0)
const rotation = refDefault(rawRotation, props.item.w === 1 ? 0 : 90)

function setRotation() {
  rotation.value = (rotation.value + 90) % 360
}
</script>

<style lang="css">
.ship-border-vertical {
  border-radius: 53% 47% 38% 39% / 85% 88% 10% 10%;
}
.ship-border-horizontal {
  border-radius:  95% 11% 12% 83% / 49% 43% 55% 51%;
}
</style>
