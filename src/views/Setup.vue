<template>
  <div class="flex flex-col items-center justify-center w-full h-full gap-4">
    <div class="relative background-grid aspect-square max-h-full max-w-xl w-full" :class="{ 'pointer-events-none': shipsConfirmed }">
      <GameGridShipLayer class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" />
    </div>
    <Button :type="shipsConfirmed ? 'ghost' : 'success'" @click="confirmSelection">
      <span v-if="shipsConfirmed" class="flex items-center gap-2">
        Waiting for other player
        <Icon class="fluent--spinner-ios-20-filled animate-spin h-4 w-4" />
      </span>
      <span v-else>Confirm</span>
    </Button>
  </div>
</template>

<script setup lang="ts">
const { shipsConfirmed } = useGame()

function confirmSelection() {
  shipsConfirmed.value = !shipsConfirmed.value
}
</script>

<style lang="css">
.background-grid {
  background-image: linear-gradient(#000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px)), linear-gradient(90deg, #000000 1px, transparent 1px, transparent calc(100% - 1px), #000000 calc(100% - 1px));
  background-size: 10% 10%;
  border: 1px solid #000000;
}
</style>
