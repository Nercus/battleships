<template>
  <div class="size-full">
    <Transition name="fade" mode="out-in">
      <div v-if="countDown > 0" key="countdown" class="fixed inset-0 flex justify-center items-center bg-base-100">
        <Transition name="fade" mode="out-in">
          <span :key="countDown" class="font-bold text-base-900 text-4xl">{{ countDown }}</span>
        </Transition>
      </div>
      <Coin v-else key="coin" :names="['Player A', 'PlayerB']" :colors="['#ff0021', '#fa7b62']" :target-side="currentSide" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const currentSide = ref<'front' | 'back'>('front')
const countDown = ref(3)

function startCountDown() {
  countDown.value = 3
  const interval = setInterval(() => {
    countDown.value -= 1
    if (countDown.value <= 0) {
      clearInterval(interval)
      countDown.value = 0
    }
  }, 1000)
}

onMounted(() => {
  startCountDown()
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
