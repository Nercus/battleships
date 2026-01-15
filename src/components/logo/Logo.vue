<template>
  <button class="w-80 md:w-full max-w-full h-80 md:h-full max-h-full aspect-square">
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
