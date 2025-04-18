<template>
  <div class="w-full h-full items-center justify-center flex flex-col">
    <div class="size-40 relative coin" :class="isHeads ? 'heads' : isTails ? 'tails' : ''">
      <div class="bg-error rounded-full size-full absolute z-[100] backface-hidden flex items-center justify-center p-3 drop-shadow-2xl">
        <Icon class="fluent--vehicle-ship-16-filled w-full h-full text-white" />
      </div>
      <div class="bg-success rounded-full size-full absolute -rotate-y-180 backface-hidden flex items-center justify-center p-3 drop-shadow-2xl">
        <Icon class="fluent--number-circle-1-16-regular w-full h-full text-white" />
      </div>
    </div>
    <div class="flex flex-row items-center justify-center mt-4 gap-2 opacity-70">
      <span class="font-semibold">You are </span>
      <div v-if="isHost" class="bg-error rounded-full size-10 flex items-center justify-center p-1 drop-shadow-2xl">
        <Icon class="fluent--vehicle-ship-16-filled w-full h-full text-white" />
      </div>
      <div v-else class="bg-success rounded-full size-10 flex items-center justify-center p-1 drop-shadow-2xl">
        <Icon class="fluent--number-circle-1-16-regular w-full h-full text-white" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameStore = useGameStore()
const { activePlayer } = storeToRefs(gameStore)
const { eventBus, isHost, sendEvent } = useConnectionStore()
const isHeads = ref(false)
const isTails = ref(false)

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
    activePlayer.value = result !== 'heads' ? 'host' : 'client'
    gameStore.switchTurn()
  }, 5000)
  return result
}

let removeListener: () => void
onMounted(() => {
  if (isHost) {
    const flipResult = flipCoin()
    sendEvent({ data: { hostSide: flipResult }, type: 'coin-flip' })
  }
  removeListener = eventBus.on((event) => {
    if (event.type === 'coin-flip') {
      const { hostSide } = event.data
      flipCoin(hostSide)
    }
  })
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
