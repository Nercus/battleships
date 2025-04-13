type GameEvent =
  | { type: 'ready', data: boolean }
  | { type: 'coin-flip', data: { hostSide: 'heads' | 'tails' } }
  | { type: 'game-over', data: { won: boolean } }
  | { type: 'attack', data: { x: number, y: number } }

const eventCallbacks = ref<((event: GameEvent) => void)[]>([])

export function useMultiplayer() {
  const { sendMessage, onMessageReceive } = useConnection()

  function sendEvent(event: GameEvent) {
    sendMessage(JSON.stringify(event))
  }

  function onEventReceive(cb: (event: GameEvent) => void) {
    eventCallbacks.value.push(cb)
  }

  onMessageReceive((message: string) => {
    try {
      const event = JSON.parse(message) as GameEvent
      eventCallbacks.value.forEach((cb) => {
        cb(event)
      })
    }
    catch (error) {
      console.error('Failed to parse message:', message, error)
    }
  })

  return {
    sendEvent,
    onEventReceive,
  }
}
