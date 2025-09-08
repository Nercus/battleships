<template>
  <div class="flex flex-col justify-center items-center gap-4 h-full">
    {{ room.roomId }}
    <Button :disabled="room.roomId.value !== ''" @click="room.createRoom()">
      Create Room
    </Button>

    <div>
      <Textarea v-model="newRoomId" placeholder="Room ID" />
    </div>
    <Button :disabled="newRoomId === ''" @click="room.joinRoom(newRoomId)">
      Join Room
    </Button>
  </div>
</template>

<script setup lang="ts">
const room = useRoom()

const newRoomId = ref('')
</script>
