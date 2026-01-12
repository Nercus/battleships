<template>
  <div class="relative flex justify-center items-center size-full overflow-hidden">
    <div class="relative flex flex-col justify-center items-center gap-2 lg:gap-4 p-4 lg:p-20 w-full max-w-xl overflow-visible">
      <CoinLogo />
      <h1 class="z-10 font-black text-2xl tracking-wide">
        Battleships
      </h1>
      <HomeStartGame v-model="role" />
      <HomeJoinGame v-model="role" />
    </div>
  </div>
</template>

<script setup lang="ts">
const role = ref<'host' | 'client' | null>(null)
</script>
