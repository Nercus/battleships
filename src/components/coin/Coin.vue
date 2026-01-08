<template>
  <TresCanvas window-size clear-color="#f5f5f5">
    <Suspense>
      <CoinScene :colors="['#4f82ce', '#4f82ce']" :names="['Nerc', 'Eminos']" show-logo />
      <template #fallback>
        Loading coin...
      </template>
    </Suspense>
  </TresCanvas>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
</script>
