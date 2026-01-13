<template>
  <button class="-mb-20 w-80 md:w-full max-w-full aspect-square cursor-pointer" @click="switchSide">
    <TresCanvas clear-color="#f5f5f5" class="-z-10 size-full">
      <Suspense>
        <CoinScene :colors="['#4f82ce', '#4f82ce']" show-logo :target-side="currentSide" />
        <template #fallback>
          Loading coin...
        </template>
      </Suspense>
    </TresCanvas>
  </button>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

const currentSide = ref<0 | 1>(0)

function switchSide() {
  currentSide.value = currentSide.value === 0 ? 1 : 0
}
</script>
