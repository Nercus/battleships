<template>
  <div
    class="w-[80%] h-[80%] aspect-square p-1 rounded-full shadow-[0px_2px_3px_2px_rgba(0,_0,_0,_0.6)] flex items-center justify-center"
    :class="{
      'bg-base-300': type === 'miss',
      'bg-error': type === 'hit',
      'bg-transparent shadow-none': type === 'none',
    }">
    <div v-if="type !== 'none'" class="w-2/3 h-2/3 bg-black/10 rounded-full shadow-[inset_0px_0px_5px_3px_rgba(0,_0,_0,_0.4)]" />
  </div>
</template>

<script setup lang="ts">
const type = ref('none') // 'hit' | 'miss'  | 'none'

onMounted(() => {
  // set a random value
  const randomValue = Math.floor(Math.random() * 4)
  if (randomValue === 0) type.value = 'hit'
  else if (randomValue === 1) type.value = 'miss'
  else if (randomValue === 2) type.value = 'sunk'
  else type.value = 'none'
})

// TODO: inherit the state from the parent component as this is reused in both PlayerTurn and OpponentTurn
</script>
