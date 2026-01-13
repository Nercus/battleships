<template>
  <div class="flex flex-col justify-center items-center gap-2 lg:gap-4 w-full">
    <CommonButton class="z-10 relative w-full max-w-xs" type="muted" size="large" @click="initiateJoinGame">
      Join Game
    </CommonButton>
    <div v-if="isJoining" class="flex flex-row items-end gap-2">
      <PinInput v-model="joinCodeInput" />
      <CommonButton type="success" size="small" class="size-10" :disabled="isTryingToJoin || joinCodeInput.join('').length !== 6" @click="connectToRoom(joinCodeInput.join(''))">
        <Icon v-if="isTryingToJoin" class="animate-spin fluent--spinner-ios-20-filled" />
        <Icon v-else class="fluent--play-24-filled" />
      </CommonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const { joinRoom, isConnected } = useConnection()

const role = defineModel<'host' | 'client' | null>()
const isJoining = computed(() => role.value === 'client')

const isTryingToJoin = ref(false)
const joinCodeInput = ref<string[]>([])

const { start, stop } = useTimeout(10000, {
  callback: () => {
    if (!isTryingToJoin.value) return
    if (!isConnected.value) {
      push.error({
        message: 'Failed to connect.',
      })
      isTryingToJoin.value = false
    }
  },
  controls: true,
})

watch(isConnected, () => {
  if (isConnected.value) {
    push.success({
      duration: 5000,
      message: 'You are now connected.',
    })
    router.push({ name: 'Setup' })
    stop()
    isTryingToJoin.value = false
  }
  if (!isConnected.value && route.meta.requiresConnection) {
    push.error({
      duration: 5000,
      message: 'You have been disconnected.',
    })
    router.push({ name: 'Start Game' })
  }
}, { immediate: true })

function connectToRoom(code: string) {
  if (isTryingToJoin.value) return
  if (!code || code?.length !== 6) {
    return
  }
  start() // Start the timeout countdown
  joinRoom(code)
  isTryingToJoin.value = true
}

function initiateJoinGame() {
  if (isJoining.value) return
  role.value = 'client'
}
</script>
