import type { UseWebSocketReturn } from '@vueuse/core'

const SERVER_URL = `webrtc.wintersperger.dev`

const connectionStore = useConnection()
const webRTC = useWebRTC()
const compression = useCompression()

interface WebSocketMessage {
  type: 'join' | 'signal'
  data?: any
}

let ws = null as UseWebSocketReturn<any> | null
const roomId = ref<string>('')
const rtcSignal = ref<string | null>(null)
const isHost = ref<boolean | null>()

export function useRoom() {
  function onMessage(_: any, event: MessageEvent<string>) {
    const message: WebSocketMessage = JSON.parse(event.data)
    if (message.type === 'join') {
      // join is sent by the client that wants to join the room
      if (!ws || !rtcSignal.value) {
        console.error('WebSocket or RTC signal is not initialized')
        return
      }
      ws.send(JSON.stringify({ data: rtcSignal.value, type: 'signal' })) // offer is returned
    }
    else if (message.type === 'signal') {
      // offer reaches client that wants to join the room
      if (isHost.value === null) {
        console.error('isHost is not set')
        return
      }

      if (isHost.value) {
        // host receives answer
        const decompressedCode = JSON.parse(compression.decompress(message.data)) as RTCSessionDescriptionInit
        webRTC.sendSignal(decompressedCode)
      }
      else {
        webRTC.signalBus.on((signal) => {
          // return answer to host
          if (!ws) {
            console.error('WebSocket is not initialized')
            return
          }
          ws.send(JSON.stringify({ data: compression.compress(JSON.stringify(signal)), type: 'signal' }))
        })

        const decompressedCode = JSON.parse(compression.decompress(message.data)) as RTCSessionDescriptionInit
        webRTC.sendSignal(decompressedCode)
      }
    }
  }

  async function createRoom(): Promise<string> {
    return new Promise((resolve, reject) => {
      webRTC.signalBus.on(async (signal) => {
        const res = await fetch(`https://${SERVER_URL}/create-room`, {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })
        const data = await res.json()
        if (!data.roomId) {
          reject(new Error('Failed to create room'))
          return
        }
        isHost.value = true
        roomId.value = data.roomId as string
        rtcSignal.value = compression.compress(JSON.stringify(signal))

        ws = useWebSocket(`wss://${SERVER_URL}/ws?roomId=${roomId.value}`, {
          onMessage,
        })

        resolve(roomId.value)
      })
      connectionStore.initConnection(true)
    })
  }

  function joinRoom(id: string | null) {
    return new Promise<void>((resolve, reject) => {
      if (!id) {
        reject(new Error('Room ID is required to join a room'))
        return
      }
      connectionStore.initConnection(false)
      roomId.value = id
      isHost.value = false
      ws = useWebSocket(`wss://${SERVER_URL}/ws?roomId=${roomId.value}`, {
        onMessage,
      })
      ws.send(JSON.stringify({ type: 'join' }))
      resolve()
    })
  }

  return {
    createRoom,
    joinRoom,
    roomId,
  }
}
