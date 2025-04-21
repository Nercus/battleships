<template>
  <div class="flex flex-col items-center justify-center gap-4 lg:gap-10 w-full max-w-lg lg:max-w-2xl p-4 lg:p-20">
    <h1 class="text-3xl font-black tracking-wide">
      Host Connect
    </h1>
    <SimpleSeparator />
    <Button v-if="isSupported" type="muted" :disabled="waitingForCode" @click="debouncedCopyLinkFn">
      <Icon v-if="waitingForCode" class="fluent--spinner-ios-20-filled animate-spin" />
      <Icon v-else class="fluent--link-24-filled" />
      {{ waitingForCode ? 'Generating invite link...' : 'Copy Invite Link' }}
    </Button>
    <div v-else class="flex flex-col items-center justify-center gap-2 w-full p-4 lg:p-10">
      <Button type="muted" @click="debouncedCopyLinkFn">
        Generate Invite Link
      </Button>
      <Textarea v-model="inviteLink" />
    </div>
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
import * as spdCompact from 'sdp-compact'

const connectionStore = useConnection()
const webRTC = useWebRTC()
const { copied, copy, isSupported } = useClipboard({
  legacy: true,
})
const inviteLink = ref('')
const waitingForCode = ref(false)
const inviteCode = ref<string | null>(null)

const clientConfirmationCode = ref('')
watch(copied, (newValue) => {
  if (newValue) {
    push.success({
      duration: 3000,
      message: 'You can now share this link with your battleship buddy.',
      title: 'Invite link copied to clipboard!',
    })
  }
})

onMounted(() => {
  connectionStore.initConnection(true)
  webRTC.signalBus.on((signal) => {
    inviteCode.value = spdCompact.compact(signal as RTCSessionDescriptionInit, { compress: true })
    waitingForCode.value = false
  })
  waitingForCode.value = true
})

async function copyInviteLink() {
  if (waitingForCode.value) {
    return
  }
  if (!inviteCode.value) {
    push.error({
      duration: 3000,
      message: 'Error generating invite link.',
      title: 'No invite link generated',
    })
    return
  }
  const baseURL = window.location.origin
  const link = `${baseURL}/#/join?code=${encodeURIComponent(inviteCode.value)}`
  inviteLink.value = link
  try {
    copy(link)
  }
  catch {
    push.error({
      duration: 3000,
      message: 'Please try again.',
      title: 'Error copying link',
    })
  }
}

async function connectToClient() {
  if (!clientConfirmationCode.value) {
    push.error({
      duration: 3000,
      message: 'Please provide a confirmation code to connect to the client.',
      title: 'No confirmation code provided',
    })
    return
  }
  try {
    const decompressedCode = spdCompact.decompact(clientConfirmationCode.value, { compress: true }) as RTCSessionDescriptionInit
    webRTC.sendSignal(decompressedCode)
  }
  catch (error) {
    console.error('Error connecting to client:', error)
    push.error({
      duration: 3000,
      message: 'Please check the confirmation code and try again.',
      title: 'Error connecting to client',
    })
  }
}

const debouncedCopyLinkFn = useDebounceFn(copyInviteLink, 200, {
  maxWait: 500,
})
</script>
