<template>
  <div class="absolute flex" :class="horizontal ? 'flex-row inset-x-0 -top-4 w-full' : 'flex-col inset-y-0 -left-4 h-full'">
    <span
      v-for="label in labels"
      :key="label" class="font-bold text-xs" :class="horizontal ? 'w-full text-center' : 'h-full flex items-center'">
      {{ label }}
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  horizontal: Boolean,
})

const labels = computed(() => {
  // for horizontal return 1-10, for vertical return A-J
  const letters = 'ABCDEFGHIJ'
  return Array.from({ length: 10 }, (_, i) => props.horizontal ? i + 1 : letters[i])
})
</script>
