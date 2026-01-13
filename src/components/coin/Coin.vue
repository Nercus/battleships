<template>
  <TresCanvas window-size clear-color="#f5f5f5">
    <Suspense>
      <CoinScene :colors="props.colors" :names="props.names" :target-side="props.targetSide" />
      <template #fallback>
        Loading coin...
      </template>
    </Suspense>
  </TresCanvas>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'

const props = defineProps<{
  colors: [string, string]
  names: [string, string]
  targetSide: 0 | 1
}>()
</script>
