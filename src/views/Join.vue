<template>
  <div class="flex flex-col justify-center items-center gap-2 md:gap-4 lg:gap-10 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <h1 class="font-black text-xl tracking-wide">
      Joining Game: {{ joinCode }}
    </h1>
    <div class="relative size-32">
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
const router = useRouter()

const { joinRoom, isConnected } = useConnection()
const joinCode = computed(() => route.query.code as string | undefined)

const { start, stop } = useTimeout(10000, {
  callback: () => {
    if (!isConnected.value) {
      push.error({
        message: 'Failed to connect.',
      })
      router.push({ name: 'Start Game' })
    }
  },
  controls: true,
}) // 10 seconds

watch(isConnected, (newVal) => {
  if (newVal) {
    stop() // Stop the timeout if connected
  }
}, { immediate: true })

onMounted(() => {
  const joinCode = route.query.code as string | undefined
  if (joinCode) {
    start() // Start the timeout countdown
    joinRoom(joinCode)
  }
  else {
    push.error({
      message: 'No join code provided in your link.',
    })
    router.push({ name: 'Start Game' })
  }
})
</script>
