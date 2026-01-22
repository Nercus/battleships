<template>
  <PinInputRoot
    id="otp" v-model="joinCodeInput" placeholder=" " class="flex items-center mt-1"
    v-bind="$attrs">
    <PinInputInput
      v-for="(id, index) in 6" :key="id" :index="index"
      class="focus-visible:z-10 relative flex justify-center items-center bg-base-100 border-border border-y-2 focus-visible:border-transparent border-r-2 first:border-l-2 last:rounded-r-base first:rounded-l-base focus-visible:outline-none ring-black focus-visible:ring-2 size-10 font-base text-base-900 text-center transition-all"
      @input="handleInput" />
  </PinInputRoot>
</template>

<script setup lang="ts">
const joinCodeInput = defineModel<string[]>()

function handleInput(event: Event, index: number) {
  const input = event.target as HTMLInputElement
  if (!joinCodeInput.value) return
  joinCodeInput.value[index] = input.value.toUpperCase()
}
</script>
