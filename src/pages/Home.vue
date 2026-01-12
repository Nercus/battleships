<template>
  <div class="relative">
    <div class="relative flex flex-col justify-center items-center gap-2 lg:gap-4 p-4 lg:p-20 w-full max-w-xl overflow-visible">
      <CoinLogo />
      <h1 class="z-10 font-semibold text-3xl tracking-wide">
        Battleships
      </h1>
      <Separator
        class="z-10 bg-linear-to-r from-transparent via-base-300 to-transparent w-full h-px"
        decorative />
      <span class="text-sm text-base-700 italic">
        Choose to start a new game or join an existing one.
      </span>
      <HomeStartGame v-model="role" />
      <HomeJoinGame v-model="role" />
    </div>
  </div>
</template>

<script setup lang="ts">
const role = ref<'host' | 'client' | null>(null)
</script>
