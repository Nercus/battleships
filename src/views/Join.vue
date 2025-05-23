<template>
  <div class="flex flex-col justify-center items-center gap-4 lg:gap-10 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <h1 class="font-black text-xl tracking-wide">
      Join Game
    </h1>
    <span class="text-center">
      {{ waitingForCode ? 'Waiting for confirmation code...' : 'Confirmation code generated!' }}
      Copy this confirmation code and send it to your host.
    </span>
    <Button v-if="isSupported" type="muted" :disabled="confirmationCode === ''" @click="debouncedCopyConfirmationFn">
      <Icon class="fluent--link-24-filled" />
      Copy Confirmation Code
    </Button>
    <div v-else class="flex flex-col justify-center items-center gap-2 p-4 lg:p-10 w-full">
      <Button type="muted" :disabled="confirmationCode === ''" @click="debouncedCopyConfirmationFn">
        Generate Confirmation Code
      </Button>
      <Textarea v-model="confirmationCode" />
    </div>
    <QRCodePopover v-if="!waitingForCode">
      <template #trigger>
        <Button size="small">
          <Icon class="fluent--qr-code-20-filled" />
          or show QR code instead
        </Button>
      </template>
      <template #content>
        <QRCode :data="confirmationCode" class="max-w-full" />
      </template>
    </QRCodePopover>
  </div>
</template>

<script setup lang="ts">
const route = useRoute<'Join'>()
const { copied, copy, isSupported } = useClipboard({
  legacy: true,
})

const connectionStore = useConnection()
const webRTC = useWebRTC()
const compression = useCompression()
const confirmationCode = ref('')
const waitingForCode = ref(false)

onMounted(() => {
  connectionStore.initConnection(false)

  webRTC.signalBus.on((signal) => {
    confirmationCode.value = compression.compress(JSON.stringify(signal))
    waitingForCode.value = false
  })

  const code = decodeURIComponent(route.query.code as string)
  if (!code) {
    push.error({
      duration: 3000,
      message: 'Please provide a confirmation code to join the game.',
      title: 'No confirmation code provided',
    })
    return
  }
  try {
    const decompressedCode = JSON.parse(compression.decompress(code)) as RTCSessionDescriptionInit
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
