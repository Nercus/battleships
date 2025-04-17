<template>
  <div class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg lg:max-w-2xl p-4 lg:p-20">
    <h1 class="text-3xl font-black tracking-wide">
      Join Game
    </h1>
    <span>
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
const { copy, isSupported, copied } = useClipboard({
  legacy: true,
})
const jsonCompressor = useJsonCompressor()
const { applyRemoteSDP } = useConnectionStore()
const confirmationCode = ref('')

watch(copied, (newValue) => {
  if (newValue) {
    push.success({
      title: 'Confirmation code copied to clipboard!',
      message: 'You can now share this code with your host.',
      duration: 3000,
    })
  }
})

onMounted(async () => {
  const code = route.query.code as string
  if (!code) {
    push.error({
      title: 'No confirmation code provided',
      message: 'Please provide a confirmation code to join the game.',
      duration: 3000,
    })
    return
  }
  try {
    const decompressedCode = jsonCompressor.decompress(code) as RTCSessionDescriptionInit
    const answer = await applyRemoteSDP(decompressedCode)
    confirmationCode.value = jsonCompressor.compress(answer as object)
  }
  catch (error) {
    console.error('Error decompressing code:', error)
    push.error({
      title: 'Error decompressing code',
      message: 'Please check the confirmation code and try again.',
      duration: 3000,
    })
  }
})

function copyConfirmationCode() {
  if (!confirmationCode.value) {
    push.error({
      title: 'No confirmation code to copy',
      message: 'Please wait for the confirmation code to be generated.',
      duration: 3000,
    })
    return
  }
  copy(confirmationCode.value)
}

const debouncedCopyConfirmationFn = useDebounceFn(copyConfirmationCode, 200, {
  maxWait: 500,
})
</script>
