<template>
  <div class="flex flex-row flex-wrap items-end md:items-center gap-4 w-full max-w-xs md:max-w-md">
    <CommonInput v-model="playerName" label="Enter your name" class="order-1 grow" />
    <SetupToolbarColorSelect v-model="playerColor" class="order-3 md:order-2 w-full md:w-fit" />
    <CommonButton type="success" class="order-2 md:order-3 w-fit" size="small" square @click="randomizeLayout">
      <Icon class="w-6 h-6 fluent--arrow-shuffle-20-filled" />
    </CommonButton>
  </div>
</template>

<script setup lang="ts">
const { playerColor, playerName, shipLayout, getRandomLayout } = useGame()

function randomizeLayout() {
  shipLayout.value = getRandomLayout()
}
onMounted(() => {
  randomizeLayout()
})
</script>
