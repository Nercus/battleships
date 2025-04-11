interface GameEvent {
  type: 'ready' | 'game-over' | 'attack'
  data: any // replace any with the correct data that is transmitted/received with the event
}

export function useMultiplayer() {
  const { sendMessage, onMessageReceive } = useConnection()

  function sendEvent(event: GameEvent) {
    sendMessage(JSON.stringify(event))
  }

  function onEventReceive(cb: (event: GameEvent) => void) {
    onMessageReceive((message: string) => {
      const event = JSON.parse(message) as GameEvent
      cb(event)
    })
  }

  return {
    sendEvent,
    onEventReceive,
  }
}
