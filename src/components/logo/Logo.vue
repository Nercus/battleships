<template>
  <div class="w-80 landscape:max-lg:w-60 md:w-full max-w-full h-80 landscape:max-lg:h-60 md:h-full max-h-full aspect-square">
    <TresCanvas class="-z-10 size-full pointer-events-none!" :clear-alpha="0" alpha>
      <TresPerspectiveCamera :args="[45, 1, 1, 500]" :position="[0, 0, 2]" :look-at="[0, 0, 0]" />
      <LogoScene />
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
</script>
