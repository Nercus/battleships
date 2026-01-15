<template>
  <div class="flex flex-col justify-center items-center gap-2 md:gap-4 w-full">
    <GridLayers>
      <template #header>
        <CommonButton variant="success" class="mb-2 w-fit text-xs" size="tiny" @click="randomizeLayout">
          <Icon class="size-3.5 fluent--arrow-shuffle-20-filled" />
          Randomize
        </CommonButton>
      </template>
      <template #layer1>
        <IndicatorGrid class="absolute inset-0" />
      </template>
      <template #layer2>
        <ShipGrid v-model:layout="shipLayout" :color="playerColor" is-draggable class="absolute inset-0 size-full" />
      </template>
      <template #footer>
        <SetupToolbar class="mt-2" />
      </template>
    </GridLayers>
    <SetupReadyButton />
  </div>
</template>

<script setup lang="ts">
const { playerColor, shipLayout, getRandomLayout } = useGame()

function randomizeLayout() {
  shipLayout.value = getRandomLayout()
}
onMounted(() => {
  randomizeLayout()
})
</script>
