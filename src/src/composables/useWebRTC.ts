import { ref } from 'vue'


const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

const localSDP = ref('')
const remoteSDP = ref('')
const dataChannelRef = ref<RTCDataChannel | null>(null)  // new reactive ref for data channel
const messagesReceived = ref<string[]>([])

export function useWebRTC() {
  const peerConnection = new RTCPeerConnection(configuration)

  // Create offer and configure data channel
  async function createOffer() {
    const dataChannel = peerConnection.createDataChannel('chat')
    dataChannelRef.value = dataChannel

    dataChannel.onopen = () => {
      console.log('Data channel open')
    }
    dataChannel.onmessage = (e) => {
      messagesReceived.value.push(e.data)
      console.log('Message received:', e.data)
    }

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)
    localSDP.value = JSON.stringify(offer)
  }

  // Apply a remote SDP (offer or answer) manually pasted by the user
  async function applyRemoteSDP() {
    try {
      const remoteDesc = JSON.parse(remoteSDP.value)
      await peerConnection.setRemoteDescription(remoteDesc)
      console.log('Remote SDP set:', remoteDesc)

      // If the remote SDP is an offer, automatically create and send an answer
      if (remoteDesc.type === 'offer') {
        const answer = await peerConnection.createAnswer()
        await peerConnection.setLocalDescription(answer)
        localSDP.value = JSON.stringify(answer)
        console.log('Created answer:', answer)
      }
    } catch (error) {
      console.error('Invalid SDP', error)
    }
  }

  // When receiving a data channel (in case of answerer)
  peerConnection.ondatachannel = (event) => {
    const dataChannel = event.channel
    dataChannelRef.value = dataChannel
    dataChannel.onopen = () => {
      console.log('Data channel open')
    }
    dataChannel.onmessage = (e) => {
      console.log('Message received:', e.data)
    }
  }

  // ICE candidate logging (manual candidate exchange if needed)
  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      console.log('New ICE candidate:', event.candidate)
    }
  }

  peerConnection.onconnectionstatechange = () => {
    console.log('Connection state:', peerConnection.connectionState)
  }


  return { localSDP, remoteSDP, createOffer, applyRemoteSDP, peerConnection, dataChannel: dataChannelRef, messagesReceived }
}
