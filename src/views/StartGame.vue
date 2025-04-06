<template>
  <div class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg p-4 lg:p-20 relative before:absolute before:block before:bg-primary/50 before:rounded-blob before:blur-2xl before:inset-1 before:z-0 ">
    <h1 class="text-3xl font-black tracking-wide z-10">
      Battleships
    </h1>
    <SimpleSeparator />
    <Button size="huge" class="w-full max-w-sm z-10" @click="startGame">
      Start Game
    </Button>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

function startGame() {
  router.push({ name: 'Host-Connect' })
}
</script>
