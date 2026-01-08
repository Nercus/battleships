<template>
  <PinInputRoot
    id="otp" v-model="joinCodeInput" placeholder=" " class="flex items-center gap-2 mt-1"
    v-bind="$attrs">
    <PinInputInput
      v-for="(id, index) in 6" :key="id" :index="index"
      class="bg-base-100 border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 size-10 text-lg text-center"
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
