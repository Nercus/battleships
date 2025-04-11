<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <div class="w-dvw h-dvh bg-base-100 overflow-hidden flex flex-col items-center justify-center">
    <RouterView />
  </div>
  <div v-if="connected" class="size-10 bg-success fixed top-0 inset-x-0" />
</template>

<script setup lang="ts">
import { Notification, Notivue } from 'notivue'
import { RouterView } from 'vue-router'

const { connected } = useConnection()
const router = useRouter()

watch(connected, (val) => {
  if (val) {
    router.push({ name: 'Setup' })
  }
})
</script>
