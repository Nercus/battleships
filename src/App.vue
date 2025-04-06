<template>
  <Notivue v-slot="item">
    <Notification :item="item" />
  </Notivue>
  <div class="w-dvw h-dvh bg-base-100 overflow-hidden flex flex-col items-center justify-center">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { Notification, Notivue } from 'notivue'
import { RouterView } from 'vue-router'
</script>
