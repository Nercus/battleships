<template>
  <div
    class="flex flex-col justify-center items-center gap-2 lg:gap-4 p-4 lg:p-20 w-full max-w-lg overflow-visible">
    <img src="../assets/logo.svg" alt="Compass Logo" class="w-1/2">
    <h1 class="z-10 font-black text-xl tracking-wide">
      Battleships
    </h1>
    <StartGameButton @start-game="startGame" />
    <Button size="small" type="muted" @click="router.push({ path: '/join' })">
      Join Game
    </Button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function startGame() {
  router.push({ path: '/host' })
}
</script>
