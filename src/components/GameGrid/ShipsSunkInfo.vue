<template>
  <HoverCardRoot>
    <HoverCardTrigger
      class="top-12 -right-2 absolute flex justify-center items-center bg-base-800 drop-shadow p-1 rounded-full size-8 translate-x-full">
      <span class="text-white text-xs">
        {{ destroyedShips.length }} / 5
      </span>
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent align="start" class="z-10 bg-white shadow-sm p-3 pl-7 border border-gray-300 rounded-xl max-w-xs">
        <HoverCardArrow />
        <div class="flex flex-col w-full">
          <span class="relative w-full">
            <Icon v-if="carrierDestroyed" class="absolute inset-0 bg-red-500 size-full fluent--dismiss-24-filled" />
            <span class="font-bold text-sm">Aircraft Carrier</span>
            <AircraftCarrier orientation="horizontal" class="-mt-4 w-full" :class="shipColors({ color: opponentColor })" />
          </span>
          <span class="relative w-4/5">
            <Icon v-if="battleshipDestroyed" class="absolute inset-0 bg-red-500 size-full fluent--dismiss-24-filled" />
            <span class="font-bold text-sm">Battleship</span>
            <Battleship orientation="horizontal" class="-mt-4 w-full" :class="shipColors({ color: opponentColor })" />
          </span>
          <span class="relative w-3/5">
            <Icon v-if="destroyerDestroyed" class="absolute inset-0 bg-red-500 size-full fluent--dismiss-24-filled" />
            <span class="font-bold text-sm">Destroyer #1</span>
            <Destroyer orientation="horizontal" class="-mt-4 w-full" :class="shipColors({ color: opponentColor })" />
          </span>
          <span class="relative w-3/5">
            <Icon v-if="bothDestroyersDestroyed" class="absolute inset-0 bg-red-500 size-full fluent--dismiss-24-filled" />
            <span class="font-bold text-sm">Destroyer #2</span>
            <Destroyer orientation="horizontal" class="-mt-4 w-full" :class="shipColors({ color: opponentColor })" />
          </span>
          <span class="relative w-2/5">
            <Icon v-if="gunshipDestroyed" class="absolute inset-0 bg-red-500 size-full fluent--dismiss-24-filled" />
            <span class="font-bold text-sm">Gunship</span>
            <Gunship orientation="horizontal" class="-mt-4 w-full" :class="shipColors({ color: opponentColor })" />
          </span>
        </div>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'

const { destroyedShips, opponentColor } = useGame()

const carrierDestroyed = computed(() => {
  return destroyedShips.value.some(ship => ship.w === 5 || ship.h === 5)
})

const battleshipDestroyed = computed(() => {
  return destroyedShips.value.some(ship => ship.w === 4 || ship.h === 4)
})

const destroyerDestroyed = computed(() => {
  return destroyedShips.value.filter(ship => ship.w === 3 || ship.h === 3).length
})

const bothDestroyersDestroyed = computed(() => {
  return destroyerDestroyed.value >= 2
})

const gunshipDestroyed = computed(() => {
  return destroyedShips.value.some(ship => ship.w === 2 || ship.h === 2)
})

const shipColors = cva(
  '',
  {
    defaultVariants: {
      color: 'blue',
    },
    variants: {
      color: {
        blue: 'fill-distinct-6',
        emerald: 'fill-distinct-4',
        green: 'fill-distinct-3',
        indigo: 'fill-distinct-7',
        orange: 'fill-distinct-1',
        rose: 'fill-distinct-9',
        teal: 'fill-distinct-5',
        violet: 'fill-distinct-8',
        yellow: 'fill-distinct-2',
      },

    },
  },
)
</script>
