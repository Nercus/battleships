import type { Layout, LayoutItem } from 'grid-layout-plus'
import type { Color } from './useGame'

const { dataBus, sendMessage } = useConnection()

type GameEvent = | { type: 'ready', data: boolean }
  | { type: 'coin-flip', data: { hostSide: 'heads' | 'tails' } }
  | { type: 'game-over', data: { won: boolean } }
  | { type: 'attack', data: { x: number, y: number } }
  | { type: 'attack-response', data: boolean } // returns true if the attack hit, false if it missed
  | { type: 'acknowledge' } // used to acknowledge the receipt of a message
  | { type: 'target', data: { x: number, y: number } } // used to send the target coordinates to the opponent
  | { type: 'color', data: Color }
  | { type: 'ship-destroyed', data: LayoutItem } // used to notify the opponent that a ship has been destroyed and sends the coordinates of the ship
  | { type: 'game-over' } // notify the opponent that the game is over, because all the player's ships have been destroyed
  | { type: 'new-game' } // used to notify to play a new game
  | { type: 'game-info', data: { board: Board, layout: Layout } } // when the game is over send the own board to the opponent for review

const eventBus = useEventBus<GameEvent>('game-event')

dataBus.on((data) => {
  try {
    const gameEvent: GameEvent = JSON.parse(data as string)
    eventBus.emit(gameEvent)
  }
  catch (error) {
    console.error('Error parsing message:', error)
  }
})

export function useEvent() {
  function sendEvent(event: GameEvent) {
    sendMessage(JSON.stringify(event))
  }

  function onEvent(callback: (event: GameEvent) => void) {
    return eventBus.on(callback)
  }

  return {
    onEvent,
    sendEvent,
  }
}
