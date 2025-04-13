const gameState = ref<'idle' | 'setup' | 'coin-flip' | 'active'>('idle')
const shipsConfirmed = ref(false)
const shipLayout = ref<boolean[][]>([])
const activePlayer = ref<'host' | 'client'>()

export function useGame() {
  const { isHost } = useConnection()
  function setShipLayout(layout: boolean[][]) {
    shipLayout.value = layout
  }

  const myTurn = computed(() => {
    return gameState.value === 'active' && activePlayer.value === (isHost.value ? 'host' : 'client')
  })
  const isReady = computed(() => shipsConfirmed.value && shipLayout.value.length > 0)
  return {
    gameState,
    isReady,
    shipsConfirmed,
    activePlayer,
    myTurn,
    setShipLayout,
  }
}
