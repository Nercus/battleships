<template>
  <TooltipProvider>
    <TooltipRoot v-model:open="isOpen" :delay-duration="0">
      <TooltipTrigger
        class="flex justify-center items-center bg-primary shadow-shadow mr-0.5 mb-0.5 p-1 border-2 size-10" @click="toggleTooltip"
        @touchstart="toggleTooltip">
        <Icon class="size-6 fluent--question-20-filled" />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          side="left"
          class="bg-base-100 shadow-shadow p-2 border-2"
          style="width: min(calc(100vw - 2rem), var(--reka-tooltip-content-available-width, 20rem)); max-width: 20rem;">
          <TooltipArrow class="bg-base-100 stroke-black" />
          <span class="font-semibold">
            How to Play:
          </span>
          <ul class="space-y-2 w-full text-sm list-disc list-inside">
            <li>
              Each player takes turns to attack a cell on their opponent's grid.
            </li>
            <li>The goal is to sink all of your opponent's ships before they sink yours.</li>
            <li>
              Click on a cell to aim at a position on your opponent's board, when it's your turn.
            </li>
            <li>
              Confirm your attack by double clicking the selected cell.
            </li>
            <li>
              A hit is marked with <div class="inline-block bg-error shadow-shadow mx-1 rounded-full size-4" />
              and a miss with <div class="inline-block bg-base-300 shadow-shadow mx-1 rounded-full size-4" />.
            </li>
          </ul>
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>

<script setup lang="ts">
const isOpen = ref(false)

function toggleTooltip() {
  isOpen.value = !isOpen.value
}
</script>
