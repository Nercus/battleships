<template>
  <div
    class="flex flex-col justify-center items-center gap-4 lg:gap-10 p-4 lg:p-20 w-full max-w-lg overflow-visible">
    <AnimatedLogo class="w-1/2" />
    <h1 class="z-10 font-black text-xl tracking-wide">
      Battleships
    </h1>
    <StartGameButton @start-game="startGame" />
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function startGame() {
  router.push({ path: '/host' })
}
</script>
