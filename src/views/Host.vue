<template>
  <div class="flex flex-col justify-center items-center gap-4 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <span class="flex flex-row justify-centers items-center gap-2 font-black text-xl tracking-wide">
      New Room
      <Input v-model="roomId" has-copy-button disabled :copy-format="generateURL" />
    </span>
    <SimpleSeparator />
    <span>
      Share this room ID with your battleship buddy to connect.
    </span>
  </div>
</template>

<script setup lang="ts">
const { roomId, createRoom } = useConnection()

onMounted(() => {
  createRoom()
})

function generateURL(code: string) {
  return `${window.location.origin}/join?code=${encodeURIComponent(code)}`
}
</script>
