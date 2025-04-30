<template>
  <div class="w-full z-10 relative max-w-xs">
    <button
      class="inset-x-0 top-0 animated-boat"
      :disabled="boatSunk"
      @click="handleBoatHit">
      <GameGridHitIndicator
        v-if="boatAttacked"
        class="size-full z-10 absolute animate-pulse"
        board-title=""
        board-type="player"
        :index="0"
        type="hit" />
      <svg
        class="text-base-700 size-14"
        :class="boatSunk ? 'animated-sunken-boat' : ''"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 14 14">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M5.75 7H1.327a.5.5 0 0 1-.384-.82l5-6A.5.5 0 0 1 6.41.007a.75.75 0 0 1 .84.745L7.249 9h6.25a.5.5 0 0 1 .468.676l-1.013 2.702A2.5 2.5 0 0 1 10.614 14H3.386a2.5 2.5 0 0 1-2.34-1.622L.031 9.676A.5.5 0 0 1 .5 9h5.25zm3.631-4.804a.5.5 0 0 0-.896.304v4a.5.5 0 0 0 .5.5h3.07a.5.5 0 0 0 .396-.804z"
          clip-rule="evenodd" />
      </svg>
    </button>
    <Button size="huge" class="w-full max-w-sm z-10 relative -mt-2" @click="emit('startGame')">
      Start Game
      <div class="absolute -top-0.5 w-full h-4 rotate-180">
        <svg
          class="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none">
          <path
            class="fill-primary"
            d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,218.7C672,213,768,171,864,160C960,149,1056,171,1152,186.7C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
        </svg>
      </div>
    </Button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['startGame'])
const boatAttacked = ref(false)
const boatSunk = ref(false)

function handleBoatHit() {
  boatAttacked.value = true
  setTimeout(() => {
    boatAttacked.value = false
    boatSunk.value = true
  }, 2000) // Reset after 2 seconds
}
</script>

<style scoped>
.animated-boat {
  position: relative;
  left: 0px; /* Start off-screen to the left */
  animation: sail 20s cubic-bezier(0.37, 0, 0.63, 1) infinite;
}

.animated-sunken-boat {
  animation: sink 2s ease-in-out forwards;
}

@keyframes sink {
  0% {
    transform: translateY(0px) rotate(0deg);
  }
  30% {
    transform: translateY(20px) rotate(10deg);
  }
  100% {
    transform: translateY(60px) rotate(90deg);
    opacity: 0;
  }
}

@keyframes sail {
  0% {
    left: 0px;
    transform: scaleX(1);
  }
  50% {
    left: calc(100% - 3.5rem);
    transform: scaleX(1);
  }
  50.001% {
    transform: scaleX(-1);
  }
  100% {
    left: 0px;
    transform: scaleX(-1);
  }
}
</style>
