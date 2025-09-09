import SimplePeer from 'simple-peer'

const SERVER_URL = `webrtc.wintersperger.dev`

const isConnected = ref(false)
const isHost = ref<boolean | null>()
const roomId = ref<string>('')
const peer = ref<SimplePeer.Instance | null>(null)
const wsUrl = computed(() => roomId.value ? `wss://${SERVER_URL}/ws?roomId=${roomId.value}` : undefined)
const { data, send, close } = useWebSocket<{ type: 'join' | 'signal', data: object | null }>(wsUrl)
const userOffer = ref<RTCSessionDescriptionInit | null>(null)
const userAnswer = ref<RTCSessionDescriptionInit | null>(null)
const dataBus = useEventBus<SimplePeer.SimplePeerData>('data')

watch(data, (message) => {
  message = JSON.parse(message as unknown as string)
  if (!message) return
  if (message.type === 'join' && isHost.value) {
    if (!userOffer.value) return
    send(JSON.stringify({ type: 'signal', data: userOffer.value }))
  }
  else if (message.type === 'signal') {
    if (!message.data) return
    // Prevent duplicate signals
    if (isConnected.value) return
    if (!peer.value) return
    peer.value.signal(message.data as RTCSessionDescriptionInit)
  }
}, { deep: true })

export function useConnection() {
  function reset() {
    isConnected.value = false
    peer.value?.destroy()
    peer.value = null
    close()
    roomId.value = ''
    isHost.value = null
    userOffer.value = null
    userAnswer.value = null
  }

  function sendMessage(message: string) {
    if (!peer.value) {
      console.error('Peer is not initialized')
      return
    }
    peer.value.send(message)
  }

  function onPeerData(data: SimplePeer.SimplePeerData) {
    dataBus.emit(data)
  }

  function onPeerSignal(data: SimplePeer.SignalData) {
    if (!peer.value) {
      console.error('Peer is not initialized')
      return
    }
    if (data.type === 'offer') {
      userOffer.value = data
    }
    else if (data.type === 'answer') {
      userAnswer.value = data
    }
    send(JSON.stringify({ type: 'signal', data }))
  }

  function onPeerConnect() {
    isConnected.value = true
  }

  function onPeerClose() {
    reset()
  }

  function onPeerError(err: Error) {
    console.error('Peer error:', err)
    reset()
  }

  function initPeer() {
    peer.value = new SimplePeer({
      initiator: !!isHost.value,
      trickle: false,
    })

    peer.value.on('signal', onPeerSignal)
    peer.value.on('connect', onPeerConnect)
    peer.value.on('close', onPeerClose)
    peer.value.on('data', onPeerData)
    peer.value.on('error', onPeerError)
  }

  async function createRoom() {
    reset()
    isHost.value = true
    initPeer()

    const newRoomData = await fetch(`https://${SERVER_URL}/create-room`, {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }).then(res => res.json())

    if (!newRoomData.roomId) {
      throw new Error('Failed to create room')
    }
    roomId.value = newRoomData.roomId as string
  }

  async function joinRoom(id: string) {
    if (!id) {
      throw new Error('Room ID is required to join a room')
    }
    isHost.value = false
    roomId.value = id
    initPeer()
    send(JSON.stringify({ type: 'join', data: null }))
  }

  return {
    reset,
    isConnected,
    createRoom,
    joinRoom,
    isHost,
    roomId,
    sendMessage,
    dataBus,
  }
}
