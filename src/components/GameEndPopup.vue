<template>
  <AlertDialogRoot :open="gameState === 'ended'">
    <AlertDialogPortal>
      <AlertDialogOverlay class="z-30 fixed inset-0 bg-base-800/50 backdrop-blur-xs" />
      <AlertDialogContent
        class="top-1/2 left-1/2 z-50 fixed bg-base-100 drop-shadow p-8 rounded focus:outline-none w-full max-w-xl -translate-1/2">
        <AlertDialogTitle class="m-0 font-semibold">
          {{ playerWon ? 'You won!' : 'You lost!' }}
        </AlertDialogTitle>
        <AlertDialogDescription class="mt-4 mb-5 text-sm leading-normal">
          <TabsRoot class="flex flex-col flex-1 gap-2" default-value="stats">
            <TabsList class="flex gap-2">
              <TabsTrigger :as="Button" size="small" type="primary" value="stats" class="opacity-80 data-[state=active]:opacity-100 data-[state=active]:outline-2 outline-offset-2">
                Stats
              </TabsTrigger>
              <TabsTrigger :as="Button" size="small" type="primary" value="board" class="opacity-80 data-[state=active]:opacity-100 data-[state=active]:outline-2 outline-offset-2" :disabled="!opponentBoardLayout || !opponentBoardHits">
                Enemy Board
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stats">
              <table class="p-1 border w-full table-auto">
                <tbody>
                  <tr v-for="(stat, key) in stats" :key="key" class="even:bg-base-200">
                    <td class="p-2 font-medium">
                      {{ stat.label }}
                    </td>
                    <td class="p-2 text-right">
                      {{ stat.value }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
            <TabsContent v-if="opponentBoardLayout && opponentBoardHits" value="board" class="relative background-grid m-4 min-h-0 aspect-square">
              <GameGridShipLayer
                v-model:layout="opponentBoardLayout"
                class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :color="opponentColor" :is-draggable="false" />
              <GameGridHitLayer
                class="absolute inset-0 w-[calc(100%-1px)] h-[calc(100%-1px)]" :board="opponentBoardHits" />
            </TabsContent>
          </TabsRoot>
        </AlertDialogDescription>
        <div class="flex justify-end gap-2 md:gap-4">
          <AlertDialogAction
            :as="Button" :type="newGameRequested ? 'ghost' : 'success'" @click="newGame">
            <span v-if="newGameRequested && !opponentRequestsNewGame" class="flex items-center gap-2 max-w-full break-words whitespace-normal">
              Waiting for other player...
              <Icon class="w-4 h-4 animate-spin fluent--spinner-ios-20-filled" />
            </span>
            <span v-else-if="!newGameRequested && opponentRequestsNewGame" class="flex items-center gap-2 max-w-full break-words whitespace-normal">
              Opponent wants a rematch! Join?
              <Icon class="w-4 h-4 fluent--checkmark-24-filled" />
            </span>
            <span v-else class="whitespace-normal">Play Again</span>
          </AlertDialogAction>

          <AlertDialogAction
            :as="Button" type="error" @click="exitGame()">
            Exit Game
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>

<script setup lang="ts">
import type { Layout } from 'grid-layout-plus'
import Button from './shared/Button.vue'

const { gameState, reset, destroyedShips, opponentBoardHitStates, opponentColor, playerBoardHitStates, shipLayout } = useGame()
const { onEvent, sendEvent } = useEvent()
const opponentRequestsNewGame = ref(false)
const newGameRequested = ref(false)
const playerWon = ref(false)
const router = useRouter()

// stats
const shipsDestroyed = computed(() => {
  return destroyedShips.value.length
})

const hits = computed(() => opponentBoardHitStates.value.flat().flat().filter(state => state === 'hit').length)
const misses = computed(() => opponentBoardHitStates.value.flat().flat().filter(state => state === 'miss').length)
const accuracy = computed(() => {
  const totalShots = hits.value + misses.value
  return totalShots === 0 ? 0 : Math.round((hits.value / totalShots) * 100)
})

const opponentBoardLayout = ref<Layout | null>()
const opponentBoardHits = ref <Board | null>()

const stats = computed(() => ({
  shipsDestroyed: {
    label: 'Ships Destroyed',
    value: shipsDestroyed.value,
  },
  hits: {
    label: 'Hits',
    value: hits.value,
  },
  misses: {
    label: 'Misses',
    value: misses.value,
  },
  accuracy: {
    label: 'Accuracy',
    value: `${accuracy.value}%`,
  },
}))

let removeListener: () => void
onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type === 'game-over') {
      gameState.value = 'ended'
      playerWon.value = true
      sendEvent({ type: 'game-info', data: { board: playerBoardHitStates.value, layout: shipLayout.value } })
    }
    else if (event.type === 'new-game') {
      opponentRequestsNewGame.value = true
    }
    else if (event.type === 'game-info' && gameState.value === 'ended') {
      const { board, layout } = event.data as { board: Board, layout: Layout }
      opponentBoardHits.value = board
      opponentBoardLayout.value = layout
    }
  })
})
onUnmounted(() => {
  if (removeListener) removeListener()
})

function newGame() {
  sendEvent({ type: 'new-game' })
  newGameRequested.value = true
}

watch(() => newGameRequested.value && opponentRequestsNewGame.value, (newVal) => {
  if (!newVal) return
  reset()
  playerWon.value = false
  opponentRequestsNewGame.value = false
  newGameRequested.value = false
  router.push({ name: 'Setup' })
})

function exitGame() {
  router.push({ name: 'Start Game' })
}
</script>

<style lang="css">
.background-grid::before {
  content: '';
  background-size: calc(calc(100% - 2px) / 10) calc(calc(100% - 2px) / 10);
  background-image:
    linear-gradient(to right, black 1px, transparent 1px), linear-gradient(to bottom, black 1px, transparent 1px);
  height: calc(100% - 2px);
  width: calc(100% - 2px);
  position: absolute;
  background-repeat: repeat;
  margin: 2px;
}
</style>
