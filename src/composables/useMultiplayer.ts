type GameEvent =
  | { type: 'ready', data: boolean }
  | { type: 'coin-flip', data: { hostSide: 'heads' | 'tails' } }
  | { type: 'game-over', data: { won: boolean } }
  | { type: 'attack', data: { x: number, y: number } }
  | { type: 'hit', data: boolean } // returns true if the attack hit, false if it missed

const eventCallbacks = ref<((event: GameEvent) => void)[]>([])

const { sendMessage, onMessageReceive } = useConnection()
export function useMultiplayer() {

  function sendEvent(event: GameEvent) {
    console.log("Sending event:", event)
    sendMessage(JSON.stringify(event))
  }

  function onEventReceive(cb: (event: GameEvent) => void) {
    eventCallbacks.value.push(cb)
  }

  return {
    sendEvent,
    onEventReceive,
  }
}

onMessageReceive((message: string) => {
  try {
    console.log("Received event:", message)
    const event = JSON.parse(message) as GameEvent
    eventCallbacks.value.forEach((cb) => {
      cb(event)
    })
  }
  catch (error) {
    console.error('Failed to parse message:', message, error)
  }
})
