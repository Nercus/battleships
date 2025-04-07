<template>
  <div class="relative w-full h-full aspect-square bg-base-100 size-10 ">
    <svg class="absolute w-full h-full text-primary/50" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" preserveAspectRatio="none"><path fill="currentColor" fill-rule="evenodd" d="M5.75 7H1.327a.5.5 0 0 1-.384-.82l5-6A.5.5 0 0 1 6.41.007a.75.75 0 0 1 .84.745L7.249 9h6.25a.5.5 0 0 1 .468.676l-1.013 2.702A2.5 2.5 0 0 1 10.614 14H3.386a2.5 2.5 0 0 1-2.34-1.622L.031 9.676A.5.5 0 0 1 .5 9h5.25zm3.631-4.804a.5.5 0 0 0-.896.304v4a.5.5 0 0 0 .5.5h3.07a.5.5 0 0 0 .396-.804z" clip-rule="evenodd" /></svg>
    <svg v-if="props.isHit" class="absolute w-1/3 h-full inset-0" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M14.04 12H10v-1H5.5A3.5 3.5 0 0 1 2 7.5A3.5 3.5 0 0 1 5.5 4c1.03 0 1.95.44 2.59 1.15C8.5 3.35 10.08 2 12 2s3.5 1.35 3.91 3.15C16.55 4.44 17.47 4 18.5 4A3.5 3.5 0 0 1 22 7.5a3.5 3.5 0 0 1-3.5 3.5h-4.46zM10 16.9v-1.14H5v-2h14v2h-4.96v1.16L20 19.08c.58.21 1 .76 1 1.42a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20.5c0-.66.42-1.21 1-1.42z" /></svg>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  isHit?: boolean
}>()
</script>
