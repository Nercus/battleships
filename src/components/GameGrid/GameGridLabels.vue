<template>
  <div class="absolute flex select-none" :class="horizontal ? 'flex-row inset-x-0 -top-4 w-full' : 'flex-col inset-y-0 -left-4 h-full'">
    <span
      v-for="(_, idx) in 10"
      :key="idx"
      class="font-bold text-xs"
      :class="horizontal ? 'w-full text-center' : 'h-full flex items-center'">
      {{ horizontal ? idx + 1 : String.fromCharCode(65 + idx) }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps({
  horizontal: Boolean,
})
</script>
