<template>
  <div class="flex flex-col items-end md:items-center gap-4 w-full max-w-xs md:max-w-md">
    <CommonInput v-model="playerName" label="Enter your name" class="w-full" maxlength="12" />
    <SetupToolbarColorSelect v-model="playerColor" class="order-3 md:order-2 w-full md:w-fit" />
  </div>
</template>

<script setup lang="ts">
const { playerColor, playerName } = useGame()
</script>
