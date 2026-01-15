<template>
  <button class="-mb-20 w-80 md:w-full max-w-full aspect-square">
    <TresCanvas clear-color="#f5f5f5" class="-z-10 size-full">
      <Suspense>
        <LogoScene />
        <template #fallback>
          Loading coin...
        </template>
      </Suspense>
    </TresCanvas>
  </button>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
</script>
