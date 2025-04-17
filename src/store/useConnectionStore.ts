const configuration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

type GameEvent =
  | { type: 'ready', data: boolean }
  | { type: 'coin-flip', data: { hostSide: 'heads' | 'tails' } }
  | { type: 'game-over', data: { won: boolean } }
  | { type: 'attack', data: { x: number, y: number } }
  | { type: 'attack-response', data: boolean } // returns true if the attack hit, false if it missed
  | { type: 'acknowledge' } // used to acknowledge the receipt of a message
  | { type: 'target', data: { x: number, y: number } } // used to send the target coordinates to the opponent

export const useConnectionStore = defineStore('connection', () => {
  const connected = ref(false)
  const isHost = ref(false)

  const peerConnection = new RTCPeerConnection(configuration)
  const dataChannel = peerConnection.createDataChannel('chat')

  // Array to hold callbacks for game events.
  const eventListeners: ((event: GameEvent) => void)[] = []

  setTimeout(() => {
    peerConnection.createOffer().then((offer) => {
      peerConnection.setLocalDescription(offer).then(() => {
        console.warn('Initial offer set!')
      })
    })
  }, 100)

  // Update the onmessage to parse and trigger event handlers.
  dataChannel.onmessage = (event) => {
    // Check if the message is a JSON string and parse it
    try {
      const gameEvent: GameEvent = JSON.parse(event.data)
      eventListeners.forEach(callback => callback(gameEvent))
    }
    catch (error) {
      console.error('Error parsing message:', error)
    }
  }
  dataChannel.onopen = () => {
    connected.value = true
  }
  dataChannel.onclose = () => {
    connected.value = false
  }

  // For incoming remote data channels
  peerConnection.ondatachannel = (event) => {
    const channel = event.channel
    channel.onmessage = (event) => {
      try {
        const gameEvent: GameEvent = JSON.parse(event.data)
        eventListeners.forEach(callback => callback(gameEvent))
      }
      catch (error) {
        if (error instanceof SyntaxError) {
          console.warn('Received non-JSON message:', event.data)
          return
        }
        console.error('Error parsing message:', error)
      }
    }
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

  async function sendMessage(message: string) {
    dataChannel.send(message)
  }

  async function closeConnection() {
    if (peerConnection) {
      peerConnection.close()
      connected.value = false
    }
  }

  function sendEvent(event: GameEvent) {
    sendMessage(JSON.stringify(event))
  }

  // Register callback for game events
  function onEventReceive(cb: (event: GameEvent) => void): () => void {
    eventListeners.push(cb)
    return () => {
      const index = eventListeners.indexOf(cb)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  function $reset() {
    connected.value = false
    isHost.value = false
  }

  return {
    isHost,
    connected,
    createOffer,
    applyRemoteSDP,
    closeConnection,
    sendEvent,
    onEventReceive,
    $reset,
  }
})
