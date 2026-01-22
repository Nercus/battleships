<template>
  <div class="flex flex-col justify-center items-center gap-2 size-full">
    <PlayerWon v-if="winner === 'player'" />
    <PlayerLost v-else-if="winner === 'opponent'" />
    <EnemyShipLayout />
    <PlayerStats />
    <ReplayButton />
  </div>
</template>

<script setup lang="ts">
const { winner } = useGame()
</script>
