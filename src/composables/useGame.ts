import type { Layout } from 'grid-layout-plus'

export const AVAILABLE_SHIPS = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
] as const

export const AVAILABLE_COLORS = [
  'orange',
  'green',
  'emerald',
  'teal',
  'blue',
  'indigo',
  'violet',
  'rose',
] as const
export type Color = typeof AVAILABLE_COLORS[number]

export type Length10Array<T> = [T, T, T, T, T, T, T, T, T, T]
export type HitType = 'hit' | 'miss' | 'none'
export type Board = Length10Array<Length10Array<HitType>>

const gameState = ref<'idle' | 'setup' | 'coin-flip' | 'active' | 'ended'>('idle')
const shipLayout = ref<Layout>([])

const playerName = ref<string | null>(null)
const playerColor = ref<Color | null>(null)
const opponentName = ref<string | null>(null)
const opponentColor = ref<Color | null>(null)
const winner = ref<'player' | 'opponent' | null>(null)

const playersTurn = ref<boolean>(false) // the player whose turn it is
const isTurnPending = ref<boolean>(false) // indicates if the player's turn is pending information exchange to switch the turn

const playerTarget = ref<{ x: number, y: number } | null>(null) // the coordinates of the target
const opponentTarget = ref<{ x: number, y: number } | null>(null) // the coordinates of the opponent's target

const playerBoardHitStates = ref<Board>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board) // the player's board, where the opponent's attacks are recorded
const opponentBoardHitStates = ref<Board>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board) // the opponent's board, where the player's attacks are recorded

const destroyedShips = ref<Layout>([])
const lostShips = ref<Layout>([])

const { sendEvent } = useEvent()
export function useGame() {
  const boardShipMap = computed(() => {
    const hitMap = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill(false)) as Length10Array<Length10Array<typeof AVAILABLE_SHIPS[number]['name'] | false>>
    shipLayout.value.forEach((el) => {
      for (let i = el.x; i < el.x + el.w; i++) {
        for (let j = el.y; j < el.y + el.h; j++) {
          hitMap[j][i] = el.i as typeof AVAILABLE_SHIPS[number]['name']
        }
      }
    })
    return hitMap
  })

  function switchTurn() {
    playersTurn.value = !playersTurn.value
  }

  function setHitStateForOpponent(isHit: boolean): boolean | undefined {
    if (gameState.value !== 'active') return
    if (!playerTarget.value) return
    const { x, y } = playerTarget.value
    opponentBoardHitStates.value[x][y] = isHit ? 'hit' : 'miss'
    playerTarget.value = null
    return true
  }

  function checkDestroyedShipForHit(x: number, y: number) {
    // compare the ship layout with the hit map to see if any ships are destroyed

    const shipName = boardShipMap.value[x][y]

    if (!shipName) return // No ship at the hit location

    const coords: { x: number, y: number }[] = []
    let isDestroyed = true

    // Check only the cells belonging to the hit ship
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (boardShipMap.value[i][j] === shipName) {
          coords.push({ x: i, y: j })
          if (playerBoardHitStates.value[i][j] !== 'hit') {
            isDestroyed = false
          }
        }
      }
    }

    if (isDestroyed) {
      const destroyedShipLayoutItem = shipLayout.value.find(el => el.i === shipName)
      if (!destroyedShipLayoutItem) return // Ship layout item not found
      sendEvent({ data: destroyedShipLayoutItem, type: 'ship-destroyed' })
      lostShips.value.push(destroyedShipLayoutItem)

      if (lostShips.value.length === shipLayout.value.length) {
        sendEvent({ type: 'game-over' })
        gameState.value = 'ended'
        winner.value = 'opponent'
      }
    }
  }

  function getHitStateForAttack(x: number, y: number) {
    if (gameState.value !== 'active') return
    if (!opponentTarget.value) return
    const { x: targetX, y: targetY } = opponentTarget.value
    if (x === targetX && y === targetY) {
      const hitState = boardShipMap.value[x][y]
      playerBoardHitStates.value[x][y] = hitState ? 'hit' : 'miss'
      opponentTarget.value = null
      checkDestroyedShipForHit(x, y)
      return hitState
    }
  }

  function reset() {
    gameState.value = 'idle'
    playersTurn.value = false
    isTurnPending.value = false
    playerTarget.value = null
    opponentTarget.value = null
    winner.value = null
    shipLayout.value = []
    playerBoardHitStates.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board
    opponentBoardHitStates.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board

    destroyedShips.value = []
    playerColor.value = null
    playerName.value = null
    opponentColor.value = null
    opponentName.value = null
    lostShips.value = []
  }

  function isOverlapping(layout: Layout, x: number, y: number, w: number, h: number) {
    for (const el of layout) {
      if (el.x < x + w && el.x + el.w > x && el.y < y + h && el.y + el.h > y) {
        return true
      }
    }
    return false
  }

  function getRandomLayout(): Layout {
    const newLayout = []

    // Randomly place ships on the grid
    for (const ship of AVAILABLE_SHIPS) {
      let placed = false
      while (!placed) {
        const x = Math.floor(Math.random() * 10)
        const y = Math.floor(Math.random() * 10)
        const isHorizontal = Math.random() < 0.5
        const w = isHorizontal ? ship.size : 1
        const h = isHorizontal ? 1 : ship.size

        // Check if the ship fits in the grid and doesn't overlap with existing ships
        if (x + w <= 10 && y + h <= 10 && !isOverlapping(newLayout, x, y, w, h)) {
          newLayout.push({ h, i: ship.name, isResizable: false, static: false, w, x, y })
          placed = true
        }
      }
    }
    return newLayout
  }

  return {
    boardShipMap,
    destroyedShips,
    gameState,
    getHitStateForAttack,
    getRandomLayout,
    isTurnPending,
    opponentBoardHitStates,
    opponentColor,
    opponentTarget,
    playerBoardHitStates,
    playerColor,
    playersTurn,
    playerTarget,
    opponentName,
    playerName,
    winner,
    reset,
    setHitStateForOpponent,
    shipLayout,
    switchTurn,
  }
}
