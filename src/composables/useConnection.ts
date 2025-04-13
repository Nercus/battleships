const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
}

const connected = ref(false)
const isHost = ref(false)

const messageCallbacks = ref<((message: string) => void)[]>([])
// TODO: save offer and answer in local storage to reconnect after refresh
const peerConnection = new RTCPeerConnection(configuration)
const dataChannel = peerConnection.createDataChannel('chat')

setTimeout(() => {
  peerConnection.createOffer().then((offer) => {
    peerConnection.setLocalDescription(offer).then(() => {
      console.warn('Initial offer set!')
    })
  })
}, 100)

export function useConnection() {
  dataChannel.onopen = () => {
    connected.value = true
  }
  dataChannel.onclose = () => {
    connected.value = false
  }

  async function createOffer() {
    if (peerConnection.iceGatheringState !== 'complete') {
      const offer = await peerConnection.createOffer()
      await peerConnection.setLocalDescription(offer)
    }
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    // if the offer contains 0.0.0.0 then recreate the offer
    return offer
  }

  async function applyRemoteSDP(SDP: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit | void> {
    if (!SDP) return
    await peerConnection.setRemoteDescription(SDP)
    if (SDP.type !== 'offer') return
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    return answer
  }

  async function onMessageReceive(cb: (message: string) => void) {
    messageCallbacks.value.push(cb)
  }

  // For the data channel created locally
  dataChannel.onmessage = (event) => {
    messageCallbacks.value.forEach(cb => cb(event.data))
  }

  // For incoming remote data channels
  peerConnection.ondatachannel = (event) => {
    const channel = event.channel
    channel.onmessage = (event) => {
      messageCallbacks.value.forEach(cb => cb(event.data))
    }
  }

  async function sendMessage(message: string) {
    dataChannel.send(message)
  }

  async function closeConnection() {
    if (peerConnection) {
      peerConnection.close()
      connected.value = false
    }
  }

  return {
    isHost,
    connected,
    createOffer,
    applyRemoteSDP,
    onMessageReceive,
    sendMessage,
    closeConnection,
  }
}
