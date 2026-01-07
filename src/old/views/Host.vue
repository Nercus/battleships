<template>
  <div class="flex flex-col justify-center items-center gap-2 md:gap-4 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <span class="flex md:flex-row flex-col justify-center items-center gap-2 font-black text-lg tracking-wide">
      New Room
      <Input v-model="roomId" has-copy-button disabled />
    </span>
    <SimpleSeparator />
    <span class="text-center">
      Share this room ID with your battleship buddy to connect.
    </span>
  </div>
</template>

<script setup lang="ts">
const { roomId, createRoom } = useConnection()

onMounted(() => {
  createRoom()
})
</script>
