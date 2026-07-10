<template>
  <div class="relative">
    <CommonButton
      class="size-10 text-lg"
      size="icon"
      variant="muted"
      :disabled="cooldownRemaining > 0"
      :aria-label="cooldownRemaining > 0 ? `Reactions available in ${cooldownSeconds} seconds` : 'Send a reaction'"
      @click="paletteOpen = !paletteOpen">
      <span v-if="cooldownRemaining > 0" class="text-tiny tabular-nums">
        {{ cooldownSeconds }}s
      </span>
      <span v-else aria-hidden="true">🙂</span>
    </CommonButton>

    <div
      v-if="paletteOpen"
      class="right-0 bottom-full z-20 absolute flex gap-1 bg-base-100 shadow-shadow mb-2 p-1 border-2 rounded-rounded">
      <button
        v-for="emoji in reactions"
        :key="emoji"
        class="flex justify-center items-center hover:bg-base-200 rounded-md size-9 text-xl transition-colors cursor-pointer"
        :aria-label="`Send ${emoji}`"
        @click="sendReaction(emoji)">
        {{ emoji }}
      </button>
    </div>

    <Teleport to="body">
      <motion.div
        v-if="receivedReaction"
        :key="reactionKey"
        class="top-1/5 left-1/2 z-50 fixed flex justify-center items-center bg-base-100 shadow-shadow p-4 border-2 rounded-rounded text-6xl pointer-events-none"
        :initial="{ opacity: 0, scale: 0.5, y: 24, x: '-50%' }"
        :animate="{ opacity: 1, scale: 1, y: 0, x: '-50%' }"
        :transition="{ duration: 0.25 }"
        role="status"
        aria-live="polite">
        {{ receivedReaction }}
      </motion.div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

const reactions = ['👍', '😂', '😮', '😢', '🔥'] as const
type Reaction = typeof reactions[number]

const COOLDOWN_MS = 3000
const DISPLAY_MS = 1800

const { onEvent, sendEvent } = useEvent()

const paletteOpen = ref(false)
const cooldownRemaining = ref(0)
const receivedReaction = ref<Reaction | null>(null)
const reactionKey = ref(0)

const cooldownSeconds = computed(() => Math.ceil(cooldownRemaining.value / 1000))

let cooldownInterval: ReturnType<typeof setInterval> | undefined
let reactionTimer: ReturnType<typeof setTimeout> | undefined
let removeListener: (() => void) | undefined

function sendReaction(emoji: Reaction) {
  if (cooldownRemaining.value > 0) return

  sendEvent({ type: 'reaction', data: emoji })
  paletteOpen.value = false
  cooldownRemaining.value = COOLDOWN_MS

  clearInterval(cooldownInterval)
  const cooldownEndsAt = Date.now() + COOLDOWN_MS
  cooldownInterval = setInterval(() => {
    cooldownRemaining.value = Math.max(0, cooldownEndsAt - Date.now())
    if (cooldownRemaining.value === 0) {
      clearInterval(cooldownInterval)
    }
  }, 100)
}

onMounted(() => {
  removeListener = onEvent((event) => {
    if (event.type !== 'reaction' || !reactions.includes(event.data as Reaction)) return

    receivedReaction.value = event.data as Reaction
    reactionKey.value += 1
    clearTimeout(reactionTimer)
    reactionTimer = setTimeout(() => {
      receivedReaction.value = null
    }, DISPLAY_MS)
  })
})

onUnmounted(() => {
  clearInterval(cooldownInterval)
  clearTimeout(reactionTimer)
  removeListener?.()
})
</script>
