<template>
  <div class="relative flex flex-col justify-center items-center w-full h-full">
    <div v-if="!waitingForCoinFlip" class="relative size-40 coin" :class="isHeads ? 'heads' : isTails ? 'tails' : ''">
      <div class="z-[100] absolute flex justify-center items-center bg-error drop-shadow-2xl p-3 rounded-full outline-8 outline-error outline-offset-4 size-full backface-hidden">
        <Icon class="w-full h-full text-white fluent--vehicle-ship-16-filled" />
      </div>
      <div class="absolute flex justify-center items-center bg-success drop-shadow-2xl p-3 rounded-full outline-8 outline-success outline-offset-4 size-full -rotate-y-180 backface-hidden">
        <Icon class="w-full h-full text-white fluent--number-circle-7-16-regular" />
      </div>
    </div>
    <div v-if="!waitingForCoinFlip" class="flex flex-row justify-center items-center gap-2 opacity-70 mt-4">
      <span class="font-semibold">You are </span>
      <div v-if="isHost" class="flex justify-center items-center bg-error drop-shadow-2xl p-1 rounded-full size-10">
        <Icon class="w-full h-full text-white fluent--vehicle-ship-16-filled" />
      </div>
      <div v-else class="flex justify-center items-center bg-success drop-shadow-2xl p-1 rounded-full size-10">
        <Icon class="w-full h-full text-white fluent--number-circle-7-16-regular" />
      </div>
    </div>
    <Icon v-else class="size-40 animate-spin fluent--spinner-ios-20-filled" />
  </div>
</template>

<script setup lang="ts">
const { playersTurn, switchTurn } = useGame()
const { onEvent, sendEvent } = useEvent()
const { isHost } = useConnection()
const isHeads = ref(false)
const isTails = ref(false)
const waitingForCoinFlip = ref(true)

// the host will always be heads, the client will always be tails

function flipCoin(forcedResult?: 'heads' | 'tails'): 'heads' | 'tails' {
  let result = Math.random() >= 0.5 ? 'heads' : 'tails' as 'heads' | 'tails'
  if (forcedResult) {
    result = forcedResult
  }
  isHeads.value = false
  isTails.value = false
  setTimeout(() => {
    if (result === 'heads') {
      isHeads.value = true
    }
    else {
      isTails.value = true
    }
  }, 100)
  setTimeout(() => {
    // set init active player
    const wonCoinFlip = result === 'heads' ? isHost.value : !isHost.value
    playersTurn.value = !wonCoinFlip // set the losing player to the active player, so the winning player can start the game
    switchTurn()
  }, 5000)
  return result
}

let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'coin-flip') {
      const { hostSide } = event.data
      flipCoin(hostSide)
      waitingForCoinFlip.value = false
    }
  })
  if (isHost.value) {
    const flipResult = flipCoin()
    setTimeout(() => {
      sendEvent({ data: { hostSide: flipResult }, type: 'coin-flip' })
      waitingForCoinFlip.value = false
    }, 1000)
  }
})
onUnmounted(() => {
  if (removeListener) removeListener()
})
</script>

<style>
@-webkit-keyframes flipHeads {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1800deg);
    -moz-transform: rotateY(1800deg);
    transform: rotateY(1800deg);
  }
}
@-webkit-keyframes flipTails {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1980deg);
    -moz-transform: rotateY(1980deg);
    transform: rotateY(1980deg);
  }
}

.heads {
  -webkit-animation: flipHeads 3s ease-out forwards;
  -moz-animation: flipHeads 3s ease-out forwards;
  -o-animation: flipHeads 3s ease-out forwards;
  animation: flipHeads 3s ease-out forwards;
}
.tails {
  -webkit-animation: flipTails 3s ease-out forwards;
  -moz-animation: flipTails 3s ease-out forwards;
  -o-animation: flipTails 3s ease-out forwards;
  animation: flipTails 3s ease-out forwards;
}
.coin {
  transition: -webkit-transform 1s ease-in;
  -webkit-transform-style: preserve-3d;
}
</style>
