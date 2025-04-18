import type { Layout } from 'grid-layout-plus'

export const AVAILABLE_SHIPS = [
  { name: 'carrier', size: 5 },
  { name: 'battleship', size: 4 },
  { name: 'cruiser', size: 3 },
  { name: 'submarine', size: 3 },
  { name: 'destroyer', size: 2 },
] as const

export type Length10Array<T> = [T, T, T, T, T, T, T, T, T, T]
export type HitType = 'hit' | 'miss' | 'none'
export type Board = Length10Array<Length10Array<HitType>>

const gameState = ref<'idle' | 'setup' | 'coin-flip' | 'active'>('idle')
const boardHitMap = ref<Length10Array<Length10Array<typeof AVAILABLE_SHIPS[number]['name'] | false>>>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill(false)) as Length10Array<Length10Array<false>>)
const shipLayout = ref<Layout>([])

const playersTurn = ref<boolean>(false) // the player whose turn it is
const isTurnPending = ref<boolean>(false) // indicates if the player's turn is pending information exchange to switch the turnplayerTarget = ref<{ x: number, y: number } | null>(null) // the coordinates of the target

const playerTarget = ref<{ x: number, y: number } | null>(null) // the coordinates of the target
const opponentTarget = ref<{ x: number, y: number } | null>(null) // the coordinates of the opponent's target

const playerBoardHitStates = ref<Board>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board) // the player's board, where the ships are placed and the opponent's attacks are recorded
const opponentBoardHitStates = ref<Board>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board) // the opponent's board, where the player's attacks are recorded

export function useGame() {
  const router = useRouter()

  function switchTurn() {
    playersTurn.value = !playersTurn.value
    if (playersTurn.value) {
      router.push('/players-turn')
    }
    else {
      router.push('/opponents-turn')
    }
  }

  function setHitStateForOpponent(isHit: boolean): boolean | undefined {
    if (gameState.value !== 'active') return
    if (!playerTarget.value) return
    const { x, y } = playerTarget.value
    opponentBoardHitStates.value[x][y] = isHit ? 'hit' : 'miss'
    playerTarget.value = null
    return true
  }

  function getHitStateForAttack(x: number, y: number) {
    if (gameState.value !== 'active') return
    if (!opponentTarget.value) return
    const { x: targetX, y: targetY } = opponentTarget.value
    if (x === targetX && y === targetY) {
      opponentBoardHitStates.value[x][y] = 'hit'
      opponentTarget.value = null
      return true
    }
  }

  function reset() {
    gameState.value = 'idle'
    playersTurn.value = false
    isTurnPending.value = false
    playerTarget.value = null
    opponentTarget.value = null
    shipLayout.value = []
    boardHitMap.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill(false)) as Length10Array<Length10Array<false>>
    playerBoardHitStates.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board
    opponentBoardHitStates.value = Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board
  }

  return {
    boardHitMap,
    gameState,
    getHitStateForAttack,
    isTurnPending,
    opponentBoardHitStates,
    opponentTarget,
    playerBoardHitStates,
    playersTurn,
    playerTarget,
    reset,
    setHitStateForOpponent,
    shipLayout,
    switchTurn,
  }
}
