type GameEvent =
  | { type: 'ready', data: boolean }
  | { type: 'coin-flip', data: { hostSide: 'heads' | 'tails' } }
  | { type: 'game-over', data: { won: boolean } }
  | { type: 'attack', data: { x: number, y: number } }
  | { type: 'attack-response', data: boolean } // returns true if the attack hit, false if it missed
  | { type: 'acknowledge' } // used to acknowledge the receipt of a message
  | { type: 'target', data: { x: number, y: number } } // used to send the target coordinates to the opponent

const eventBus = useEventBus<GameEvent>('game-event')
const webRTC = useWebRTC()
const connected = ref(false)

webRTC.dataBus.on((data: string) => {
  try {
    const gameEvent: GameEvent = JSON.parse(data)
    eventBus.emit(gameEvent)
  }
  catch (error) {
    console.error('Error parsing message:', error)
  }
})

webRTC.connectBus.on(() => {
  connected.value = true
})

webRTC.closeBus.on(() => {
  connected.value = false
})

export function useConnection() {
  function sendEvent(event: GameEvent) {
    webRTC.sendMessage(JSON.stringify(event))
  }

  async function closeConnection() {
    webRTC.closePeer()
    connected.value = false
  }

  function reset() {
    webRTC.closePeer()
    connected.value = false
  }

  function initConnection(host: boolean) {
    webRTC.createPeer(host)
  }

  return {
    closeConnection,
    connected,
    eventBus,
    initConnection,
    reset,
    sendEvent,
  }
}
