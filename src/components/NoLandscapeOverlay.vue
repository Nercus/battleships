<template>
  <div v-if="isLandscape" class="z-50 fixed inset-0 flex flex-col justify-center items-center gap-2 bg-base-100 to-transparent w-screen h-screen">
    <div class="relative">
      <Icon class="size-20 rotate-infinite fluent--phone-16-filled" />
    </div>
    <span class="max-w-xl font-medium text-center">
      Please rotate your device to portrait mode to play the game. Adjusting the game for landscape was not fun. Might do it in the future. <Icon class="size-4.5 fluent--emoji-smile-slight-24-regular" />
    </span>
  </div>
</template>

<script setup lang="ts">
const { orientation, angle } = useScreenOrientation()
const isLandscape = computed(() => {
  return orientation.value === 'landscape-secondary' || angle.value === 90 || angle.value === -90
})

</script>

<style lang="css" scoped>
.rotate-infinite {
  animation: rotate-to-portrait 2s infinite;
}
@keyframes rotate-to-portrait {
  0% {
    transform: rotate(-90deg);
    opacity: 0.5;
  }

  100% {
    transform: rotate(0deg);
    opacity: 1;
  }
}
</style>
