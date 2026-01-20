<template>
  <div class="flex landscape:max-lg:flex-row flex-col justify-center items-center gap-2 landscape:max-lg:gap-1 md:gap-4 size-full">
    <div class="relative flex flex-row justify-center items-center w-full landscape:max-lg:w-fit h-88 landscape:max-lg:h-66 md:h-110 overflow-visible">
      <PlayerTurnGrid />
      <Separator class="hidden landscape:max-lg:hidden md:block bg-base-700 mx-2 w-px h-full" orientation="vertical" />
      <OpponentTurnGrid />
    </div>
    <PlayToolbar class="mb-4 landscape:max-lg:mb-0" />
  </div>
</template>

<script setup lang="ts">
const { gameState } = useGame()
const router = useRouter()

watch(gameState, (newState) => {
  if (newState === 'ended') {
    router.push({ name: 'End' })
  }
})
</script>
