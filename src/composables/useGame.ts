const gameState = ref<'idle' | 'setup' | 'active'>('active')
const shipsConfirmed = ref(false)
const shipLayout = ref<boolean[][]>([])

export function useGame() {
  function setShipLayout(layout: boolean[][]) {
    shipLayout.value = layout
  }

  const isReady = computed(() => shipsConfirmed.value && shipLayout.value.length > 0)
  return {
    gameState,
    isReady,
    shipsConfirmed,
    setShipLayout,
  }
}
