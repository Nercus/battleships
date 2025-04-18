import type { SignalData } from 'simple-peer'
import SimplePeer from 'simple-peer'

const peer = ref<SimplePeer.Instance | null>(null)
const isHost = ref<boolean | null>(null)
const signalBus = useEventBus<SignalData>('signal')
const connectBus = useEventBus('connect')
const closeBus = useEventBus('close')
const dataBus = useEventBus<any>('data')
const errorBus = useEventBus<Error>('error')

export function useWebRTC() {
  function createPeer(isHostValue: boolean) {
    isHost.value = isHostValue
    if (isHost.value === null) {
      console.error('isHost must be set before initializing peer')
      return
    }
    if (peer.value) {
      console.warn('Peer already exists, closing previous connection')
      closePeer()
    }

    peer.value = new SimplePeer({
      initiator: isHost.value,
      trickle: false,
    })

    peer.value.on('signal', (data) => {
      signalBus.emit(data)
    })

    peer.value.on('connect', () => {
      connectBus.emit()
    })

    peer.value.on('data', (data) => {
      dataBus.emit(data)
    })

    peer.value.on('error', (err) => {
      console.error('Error:', err)
      errorBus.emit(err)
    })

    peer.value.on('close', () => {
      peer.value = null
      console.warn('Connection closed')
      closeBus.emit()
    })
  }

  function closePeer() {
    if (peer.value) {
      peer.value.destroy()
      peer.value = null
    }
  }

  function sendMessage(message: string) {
    if (!peer.value) {
      console.error('Peer is not initialized')
      return
    }
    peer.value.send(message)
  }

  function sendSignal(signal: any) {
    if (!peer.value) {
      console.error('Peer is not initialized')
      return
    }
    peer.value.signal(signal)
  }

  return {
    closeBus,
    closePeer,
    connectBus,
    createPeer,
    dataBus,
    errorBus,
    isHost,
    sendMessage,
    sendSignal,
    signalBus,
  }
}
