<template>
  <div>
    <h2>WebRTC Connection</h2>
    <button @click="createOffer">Create Offer</button>
    <textarea v-model="localSDP" placeholder="Local SDP (copy from here)"></textarea>
    <textarea v-model="remoteSDP" placeholder="Paste remote SDP here"></textarea>
    <button @click="applyRemoteSDP">Apply Remote SDP</button>
  <button @click="copyLinkToClipboard">Copy Link</button>
    <hr />

    <h3>Send a message</h3>
    <input v-model="messageToSend" placeholder="Enter message" />
    <button @click="sendMessage">Send</button>

    <div v-if="messagesReceived.length">
      <h3>Received messages</h3>
      <ul>
        <li v-for="(msg, index) in messagesReceived" :key="index">{{ msg }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import pako from 'pako'
import { useWebRTC } from '../composables/useWebRTC'

const { localSDP, remoteSDP, createOffer, applyRemoteSDP, dataChannel, messagesReceived } = useWebRTC()
const messageToSend = ref('')

// Generate the share link by compressing the SDP info
const shareLink = computed(() => {
  const sdps = {
    offer: localSDP.value,
    answer: remoteSDP.value
  }
  const jsonString = JSON.stringify(sdps)
  const compressed = pako.deflate(jsonString, { to: 'string' })
  const base64encoded = btoa(compressed)
  return `${window.location.origin}/?sdp=${encodeURIComponent(base64encoded)}`
})

function copyLinkToClipboard() {
  const link = shareLink.value
  navigator.clipboard.writeText(link).then(() => {
    console.log('Link copied to clipboard:', link)
  }).catch(err => {
    console.error('Failed to copy link:', err)
  })
}

function sendMessage() {
  if (dataChannel.value) {
    console.log('Current dataChannel state:', dataChannel.value.readyState)
    if (dataChannel.value.readyState === 'open') {
      dataChannel.value.send(messageToSend.value)
      console.log('Sent message:', messageToSend.value)
    } else {
      console.warn('Data channel is not open')
    }
  } else {
    console.warn('Data channel is not initialized')
  }
}
</script>

<style scoped>
textarea {
  width: 100%;
  height: 120px;
  margin-bottom: 1em;
}
</style>
