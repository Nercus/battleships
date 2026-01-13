<template>
  <div class="flex flex-col justify-center items-center gap-2 lg:gap-4 w-full">
    <CommonButton class="z-10 relative w-full max-w-xs" size="large" @click="initiateStartGame">
      Start Game
    </CommonButton>
    <span v-if="isStarting && isLoading" class="flex flex-row justify-center items-center gap-2">
      <Icon class="animate-spin fluent--spinner-ios-20-filled" />
      <span class="text-base-content italic">Loading new room!</span>
    </span>
    <CommonInput v-else-if="isStarting && !isLoading" v-model="roomId" has-copy-button disabled class="w-2/3 text-lg text-center" />
  </div>
</template>

<script setup lang="ts">
const { roomId, createRoom } = useConnection()

const role = defineModel<'host' | 'client' | null>()
const isStarting = computed(() => role.value === 'host')
const isDebounced = ref(false)

const isLoading = computed(() => !roomId.value || isDebounced.value)

const debounceCreateRoom = useDebounceFn(() => {
  isDebounced.value = false
  createRoom()
}, 500)

function initiateStartGame() {
  if (isStarting.value) return
  role.value = 'host'
  isDebounced.value = true
  debounceCreateRoom()
}
</script>
