<template>
  <TresCanvas clear-color="#f5f5f5" window-size>
    <Suspense>
      <CoinScene :colors="['#4f82ce', '#4f82ce']" show-logo />
      <template #fallback>
        Loading coin...
      </template>
    </Suspense>
  </TresCanvas>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
</script>
