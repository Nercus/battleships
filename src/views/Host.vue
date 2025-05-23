<template>
  <div class="flex flex-col justify-center items-center gap-4 p-4 lg:p-20 w-full max-w-lg lg:max-w-2xl">
    <h1 class="font-black text-xl tracking-wide">
      Host Connect
    </h1>
    <SimpleSeparator />
    <Button v-if="isSupported" type="muted" :disabled="waitingForCode" @click="debouncedCopyLinkFn">
      <Icon v-if="waitingForCode" class="animate-spin fluent--spinner-ios-20-filled" />
      <Icon v-else class="fluent--link-24-filled" />
      {{ waitingForCode ? 'Generating invite link...' : 'Copy Invite Link' }}
    </Button>
    <div v-else class="flex flex-col justify-center items-center gap-2 p-4 lg:p-10 w-full">
      <Button type="muted" @click="debouncedCopyLinkFn">
        Generate Invite Link
      </Button>
      <Textarea v-model="inviteLink" />
    </div>
    <QRCodePopover v-if="!waitingForCode">
      <template #trigger>
        <Button size="small">
          <Icon class="fluent--qr-code-20-filled" />
          or show QR code instead
        </Button>
      </template>
      <template #content>
        <QRCode :data="inviteLink" />
      </template>
    </QRCodePopover>
    <SimpleSeparator />
    <div class="flex flex-col justify-center items-center gap-2 p-4 w-full">
      <h2 class="font-bold text-xl">
        Paste confirmation code
      </h2>
      <QRCodePopover v-if="!waitingForCode">
        <template #trigger>
          <Button size="small" type="success" @click="requestAccess()">
            <Icon class="fluent--qr-code-20-filled" />
            or read confirmation code from QR code
          </Button>
        </template>
        <template #content>
          <qrcode-stream v-if="accessState === 'granted'" class="bg-base-300 border w-full max-w-screen" @detect="onDetect" />
          <span v-else>Camera access not granted!</span>
        </template>
      </QRCodePopover>
      <Textarea v-model="clientConfirmationCode" />
      <Button type="success" :disabled="clientConfirmationCode === ''" @click="connectToClient()">
        Connect
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DetectedBarcode } from 'vue-qrcode-reader'

const { query: requestAccess, state: accessState } = usePermission('camera', {
  controls: true,
})

const compression = useCompression()
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
  // request camera access
  connectionStore.initConnection(true)
  webRTC.signalBus.on((signal) => {
    inviteCode.value = compression.compress(JSON.stringify(signal))
    waitingForCode.value = false
    generateInviteLink()
  })
  waitingForCode.value = true
})

async function generateInviteLink() {
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
}

async function copyInviteLink() {
  await generateInviteLink()
  try {
    copy(inviteLink.value)
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
    const decompressedCode = JSON.parse(compression.decompress(clientConfirmationCode.value)) as RTCSessionDescriptionInit
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

function onDetect(qrData: DetectedBarcode[]) {
  if (!qrData?.length || qrData.length === 0) return
  const data = qrData[0].rawValue
  clientConfirmationCode.value = data
  connectToClient()
}

const debouncedCopyLinkFn = useDebounceFn(copyInviteLink, 200, {
  maxWait: 500,
})
</script>
