<template>
  <div class="flex flex-col justify-center items-center gap-2 md:gap-4 lg:gap-10 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <h1 class="font-black text-lg tracking-wide">
      {{ isTryingToJoin ? 'Joining...' : 'Enter a game code!' }}
    </h1>
    <span v-if="!isTryingToJoin" class="flex flex-col justify-start items-start gap-1 font-bold text-sm tracking-wide">
      Enter room code
      <PinInputRoot id="otp" v-model="joinCodeInput" placeholder=" " class="flex items-center gap-2 mt-1" :disabled="isTryingToJoin">
        <PinInputInput
          v-for="(id, index) in 6" :key="id" :index="index"
          class="border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 size-10 text-lg text-center" @input="joinCodeInput[index] = $event.target.value.toUpperCase()" />
      </PinInputRoot>
    </span>
    <Button
      v-if="!isTryingToJoin"
      :disabled="isTryingToJoin || joinCode?.length !== 6" class="w-full md:w-auto" color="primary"
      @click="connectToRoom(joinCode)">
      Join Game
    </Button>
    <div v-if="isTryingToJoin" class="relative size-32">
      <Icon class="absolute inset-0 m-auto size-32 text-primary animate-spin fluent--spinner-ios-20-regular" />
      <svg
        class="absolute inset-0 m-auto size-14 text-base-700"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M5.75 7H1.327a.5.5 0 0 1-.384-.82l5-6A.5.5 0 0 1 6.41.007a.75.75 0 0 1 .84.745L7.249 9h6.25a.5.5 0 0 1 .468.676l-1.013 2.702A2.5 2.5 0 0 1 10.614 14H3.386a2.5 2.5 0 0 1-2.34-1.622L.031 9.676A.5.5 0 0 1 .5 9h5.25zm3.631-4.804a.5.5 0 0 0-.896.304v4a.5.5 0 0 0 .5.5h3.07a.5.5 0 0 0 .396-.804z"
          clip-rule="evenodd" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute<'Join'>()

const isTryingToJoin = ref(false)
const { joinRoom, isConnected } = useConnection()
const joinCodeInput = ref<string[]>([])
const joinCode = computed(() => joinCodeInput.value.join(''))

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
}) // 10 seconds



watch(isConnected, () => {
  if (isConnected.value) {
    push.success({
      duration: 5000,
      message: 'You are now connected.',
    })
    stop() // Stop the timeout if connected
    isTryingToJoin.value = false
    router.push({ name: 'Setup' })
  }
  if (!isConnected.value && route.meta.requiresConnection) {
    push.error({
      duration: 5000,
      message: 'You have been disconnected.',
    })
    router.push({ name: 'Start Game' })
  }
}, { immediate: true })


onMounted(() => {
  connectToRoom(route.query.code as string)
  const linkCode = route.query.code as string
  if (linkCode) {
    start() // Start the timeout countdown
    joinRoom(linkCode)
    isTryingToJoin.value = true
  }
})

function connectToRoom(code: string) {
  if (isTryingToJoin.value) return
  if (!code || code?.length !== 6) {
    return
  }
  start() // Start the timeout countdown
  joinRoom(code)
  isTryingToJoin.value = true
}
</script>
