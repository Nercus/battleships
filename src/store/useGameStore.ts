type GameState = 'idle' | 'setup' | 'coin-flip' | 'active'
type Length10Array<T> = [T, T, T, T, T, T, T, T, T, T]
export type HitType = 'hit' | 'miss' | 'none'
export type Board = Length10Array<Length10Array<HitType>>

export const useGameStore = defineStore('game', () => {
  const connectionStore = useConnectionStore()
  const { isHost } = storeToRefs(connectionStore)
  const gameState = ref<GameState>('idle')
  const shipsConfirmed = ref(false)
  const shipLayout = ref<boolean[][]>([])
  const activePlayer = ref<'host' | 'client'>()

  const target = ref('')
  const activeAttack = ref<{ x: number, y: number } | null>(null) // the coordinates of the attack

  const playerBoard = ref<Board>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board) // the player's board, where the ships are placed and the opponent's attacks are recorded
  const opponentBoard = ref<Board>(Array.from({ length: 10 }, () => Array.from({ length: 10 }).fill('none')) as Board) // the opponent's board, where the player's attacks are recorded

  const router = useRouter()
  function setShipLayout(layout: boolean[][]) {
    shipLayout.value = layout
  }

  const myTurn = computed(() => activePlayer.value === (isHost.value ? 'host' : 'client'))

  function switchTurn() {
    if (gameState.value !== 'active') return
    if (!activePlayer.value) return
    // set to the opposite player
    if (activePlayer.value === 'host') {
      activePlayer.value = 'client'
    }
    else {
      activePlayer.value = 'host'
    }

    const isMyTurn = activePlayer.value === (isHost.value ? 'host' : 'client')
    // route push to the correct page
    if (isMyTurn) {
      router.push('/players-turn')
    }
    else {
      router.push('/opponents-turn')
    }
  }

  function setHitStateForOpponent(isHit: boolean): boolean | undefined {
    if (!activePlayer.value) return
    if (gameState.value !== 'active') return
    if (!activeAttack.value) return
    if (!myTurn.value) return
    const { x, y } = activeAttack.value
    opponentBoard.value[x][y] = isHit ? 'hit' : 'miss'
    activeAttack.value = null
    target.value = ''
    return true
  }

  function getHitStateForAttack(x: number, y: number) {
    if (!activePlayer.value) return
    if (gameState.value !== 'active') return
    if (myTurn.value) return // player can't be attacked if it's their turn
    const hit = shipLayout.value[x][y]
    if (hit) {
      playerBoard.value[x][y] = 'hit'
    }
    else {
      playerBoard.value[x][y] = 'miss'
    }
    return hit
  }

  const isReady = computed(() => shipsConfirmed.value && shipLayout.value.length > 0)
  return {
    gameState,
    isReady,
    myTurn,
    shipsConfirmed,
    activePlayer,
    setShipLayout,
    activeAttack,
    switchTurn,
    setHitStateForOpponent,
    getHitStateForAttack,
    playerBoard,
    opponentBoard,
    target,
  }
})
