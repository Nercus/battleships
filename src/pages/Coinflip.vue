<template>
  <div class="size-full">
    <Transition name="fade" mode="out-in">
      <div v-if="countDown > 0" key="countdown" class="fixed inset-0 flex justify-center items-center bg-base-100">
        <Transition name="fade" mode="out-in">
          <span :key="countDown" class="font-bold text-base-900 text-4xl">{{ countDown }}</span>
        </Transition>
      </div>
      <Coin v-else key="coin" :names="playerNames" :colors="playerColors" :target-side="currentSide" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const { playersTurn, switchTurn, playerName, opponentName, playerColor, opponentColor } = useGame()
const { onEvent, sendEvent } = useEvent()
const { isHost, isConnected } = useConnection()

const waitingForCoinFlip = ref(true)
const currentSide = ref<0 | 1>(0)
const countDown = ref(3)

const playerNames = computed<[string, string]>(() => {
  if (!playerName.value || !opponentName.value) {
    return ['Player 1', 'Player 2']
  }
  return isHost.value ? [playerName.value, opponentName.value] : [opponentName.value, playerName.value]
})

const playerColors = computed<[string, string]>(() => {
  if (!playerColor.value || !opponentColor.value) {
    return ['#FF0000', '#0000FF']
  }
  return isHost.value ? [playerColor.value, opponentColor.value] : [opponentColor.value, playerColor.value]
})

function startCountDown() {
  countDown.value = 3
  const interval = setInterval(() => {
    countDown.value -= 1
    if (countDown.value <= 0) {
      clearInterval(interval)
      countDown.value = 0
      triggerCoinFlip()
    }
  }, 1000)
}

function flipCoin(forcedResult?: 0 | 1): 0 | 1 {
  let result: 0 | 1
  if ((forcedResult === null || forcedResult === undefined) && isHost.value === false) {
    console.warn('Only the host can flip the coin!')
    return 0
  }
  if (forcedResult) {
    result = forcedResult
  }
  else {
    result = Math.random() >= 0.5 ? 0 : 1 as 0 | 1
  }
  currentSide.value = result
  setTimeout(() => {
    // set init active player
    const wonCoinFlip = result === 0 ? isHost.value : !isHost.value
    playersTurn.value = !wonCoinFlip // set the losing player to the active player, so the winning player can start the game
    switchTurn()
    if (!isConnected.value) return
    router.push('/play')
  }, 5000)
  return result
}

function triggerCoinFlip() {
  // the host is the only one who can trigger the coin flip
  if (!isHost.value) return
  const flipResult = flipCoin()
  setTimeout(() => {
    sendEvent({ data: { hostSide: flipResult }, type: 'coin-flip' })
    waitingForCoinFlip.value = false
  }, 1000)
}

let removeListener: () => void
onMounted(() => {
  startCountDown()
  removeListener = onEvent((event) => {
    if (event.type === 'coin-flip') {
      const { hostSide } = event.data
      flipCoin(hostSide)
      waitingForCoinFlip.value = false
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.65, 0, 0.35, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
