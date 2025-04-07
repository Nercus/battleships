const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
}

const connected = ref(false)
// TODO: save offer and answer in local storage to reconnect after refresh

export function useConnection() {
  const peerConnection = new RTCPeerConnection(configuration)
  const dataChannel = peerConnection.createDataChannel('chat')
  setTimeout(async () => {
    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
  }, 100)
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
      push.error({
        title: 'Error',
        message: 'Internal error occurred. Please try again!',
        duration: 5000,
      })
      return
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
    peerConnection.ondatachannel = (event) => {
      const dataChannel = event.channel
      dataChannel.onmessage = (event) => {
        cb(event.data)
      }
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
    connected,
    createOffer,
    applyRemoteSDP,
    onMessageReceive,
    sendMessage,
    closeConnection,
  }
}
