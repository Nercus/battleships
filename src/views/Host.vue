<template>
  <div class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg lg:max-w-2xl p-4 lg:p-20">
    <h1 class="text-3xl font-black tracking-wide">
      Host Connect
    </h1>
    <SimpleSeparator />
    <Button type="muted" @click="debouncedCopyLinkFn">
      <Icon class="fluent--link-24-filled" />
      Copy Invite Link
    </Button>
    <div class="flex flex-col items-center justify-center gap-2 w-full p-4 lg:p-10">
      <h2 class="text-xl font-bold">
        Paste confirmation code
      </h2>
      <Textarea v-model="clientConfirmationCode" />
      <Button type="success" :disabled="clientConfirmationCode === ''" @click="connectToClient()">
        Connect
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useJsonCompressor } from '../composables/useJsonCompressor'

const jsonCompressor = useJsonCompressor()
const { createOffer, applyRemoteSDP } = useConnection()
const { copy } = useClipboard()

const clientConfirmationCode = ref('')

async function copyInviteLink() {
  const baseURL = window.location.origin
  const offer = await createOffer()
  const compressedOffer = jsonCompressor.compress(offer as object)
  const link = `${baseURL}/join?code=${compressedOffer}`
  try {
    copy(link)
    // Logic to copy the invite link to the clipboard
    push.success({
      title: 'Invite link copied to clipboard!',
      message: 'You can now share this link with your battleship buddy.',
      duration: 3000,
    })
  }
  catch {
    push.error({
      title: 'Error copying link',
      message: 'Please try again.',
      duration: 3000,
    })
  }
}

async function connectToClient() {
  if (!clientConfirmationCode.value) {
    push.error({
      title: 'No confirmation code provided',
      message: 'Please provide a confirmation code to connect to the client.',
      duration: 3000,
    })
    return
  }
  try {
    const decompressedCode = jsonCompressor.decompress(clientConfirmationCode.value) as RTCSessionDescriptionInit
    await applyRemoteSDP(decompressedCode)
  }
  catch (error) {
    console.error('Error connecting to client:', error)
    push.error({
      title: 'Error connecting to client',
      message: 'Please check the confirmation code and try again.',
      duration: 3000,
    })
  }
}

const debouncedCopyLinkFn = useDebounceFn(copyInviteLink, 200, {
  maxWait: 500,
})
</script>
