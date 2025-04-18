<template>
  <div class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg lg:max-w-2xl p-4 lg:p-20">
    <h1 class="text-3xl font-black tracking-wide">
      Join Game
    </h1>
    <span>
      {{ waitingForCode ? 'Waiting for confirmation code...' : 'Confirmation code generated!' }}
      Copy this confirmation code and send it to your host.
    </span>
    <Button v-if="isSupported" type="muted" :disabled="confirmationCode === ''" @click="debouncedCopyConfirmationFn">
      <Icon class="fluent--link-24-filled" />
      Copy Confirmation Code
    </Button>
    <div v-else class="flex flex-col items-center justify-center gap-2 w-full p-4 lg:p-10">
      <Button type="muted" :disabled="confirmationCode === ''" @click="debouncedCopyConfirmationFn">
        Generate Confirmation Code
      </Button>
      <Textarea v-model="confirmationCode" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute<'Join'>()
const { copied, copy, isSupported } = useClipboard({
  legacy: true,
})
const jsonCompressor = useJsonCompressor()
const connectionStore = useConnection()
const webRTC = useWebRTC()
const confirmationCode = ref('')
const waitingForCode = ref(false)

onMounted(() => {
  connectionStore.initConnection(false)

  webRTC.signalBus.on((signal) => {
    confirmationCode.value = jsonCompressor.compress(signal)
    waitingForCode.value = false
  })

  const code = route.query.code as string
  if (!code) {
    push.error({
      duration: 3000,
      message: 'Please provide a confirmation code to join the game.',
      title: 'No confirmation code provided',
    })
    return
  }
  try {
    const decompressedCode = jsonCompressor.decompress(code) as RTCSessionDescriptionInit
    webRTC.sendSignal(decompressedCode)
    waitingForCode.value = true
  }
  catch (error) {
    console.error('Error decompressing code:', error)
    push.error({
      duration: 3000,
      message: 'Please check the confirmation code and try again.',
      title: 'Error decompressing code',
    })
  }
})

watch(copied, (newValue) => {
  if (newValue) {
    push.success({
      duration: 3000,
      message: 'You can now share this code with your host.',
      title: 'Confirmation code copied to clipboard!',
    })
  }
})

function copyConfirmationCode() {
  if (!confirmationCode.value) {
    push.error({
      duration: 3000,
      message: 'Please wait for the confirmation code to be generated.',
      title: 'No confirmation code to copy',
    })
    return
  }
  copy(confirmationCode.value)
}

const debouncedCopyConfirmationFn = useDebounceFn(copyConfirmationCode, 200, {
  maxWait: 500,
})
</script>
