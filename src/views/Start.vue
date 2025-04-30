<template>
  <div
    class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg overflow-visible p-4 lg:p-20 ">
    <h1 class="text-xl font-black tracking-wide z-10">
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
