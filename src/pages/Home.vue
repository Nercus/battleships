<template>
  <div class="relative flex justify-center items-center size-full overflow-hidden">
    <CoinLogo class="fixed inset-x-0 mx-auto size-full" />
    <div class="fixed inset-0 bg-radial from-40% from-white/90 to-transparent size-full" />
    <div class="relative flex flex-col justify-center items-center gap-2 lg:gap-4 p-4 lg:p-20 w-full max-w-lg overflow-visible">
      <h1 class="z-10 font-black text-2xl tracking-wide">
        Battleships
      </h1>
      <CommonButton class="z-10 relative w-full max-w-xs" size="large" @click="initiateStartGame">
        Start Game
      </CommonButton>
      <CommonInput v-if="isStarting" v-model="roomId" has-copy-button disabled />
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
  </div>
</template>

<script setup lang="ts">
const { roomId, createRoom, joinRoom, isConnected } = useConnection()

const router = useRouter()
const route = useRoute()

const isStarting = ref(false)
const isJoining = ref(false)

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

function initiateStartGame() {
  if (isStarting.value) return
  isStarting.value = true
  isJoining.value = false
  createRoom()
}

function initiateJoinGame() {
  if (isJoining.value) return
  isJoining.value = true
  isStarting.value = false
}
</script>
