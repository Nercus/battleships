<template>
  <div class="flex flex-col mb-2 p-y1 px-4">
    <h2 class="mb-1 text-sm text-left">
      {{ opponentName }}'s ships
    </h2>
    <div class="flex flex-row landscape:max-lg:flex-col flex-wrap justify-between gap-2">
      <div class="relative h-6.5 landscape:max-lg:h-5 md:h-10">
        <AircraftCarrier orientation="horizontal" class="w-auto h-full" :class="shipVariants({ color: opponentColor, destroyed: aircraftCarrierDestroyed })" />
        <ShipSunkIndicator v-if="aircraftCarrierDestroyed" :length="5" orientation="horizontal" />
      </div>
      <div class="relative h-6.5 landscape:max-lg:h-5 md:h-10">
        <Battleship orientation="horizontal" class="w-auto h-full" :class="shipVariants({ color: opponentColor, destroyed: battleshipDestroyed })" />
        <ShipSunkIndicator v-if="battleshipDestroyed" :length="4" orientation="horizontal" />
      </div>
      <div class="relative h-6.5 landscape:max-lg:h-5 md:h-10">
        <Destroyer orientation="horizontal" class="w-auto h-full" :class="shipVariants({ color: opponentColor, destroyed: destroyersDestroyed >= 1 })" />
        <ShipSunkIndicator v-if="destroyersDestroyed >= 1" :length="3" orientation="horizontal" />
      </div>
      <div class="relative h-6.5 landscape:max-lg:h-5 md:h-10">
        <Destroyer orientation="horizontal" class="w-auto h-full" :class="shipVariants({ color: opponentColor, destroyed: destroyersDestroyed === 2 })" />
        <ShipSunkIndicator v-if="destroyersDestroyed === 2" :length="3" orientation="horizontal" />
      </div>
      <div class="relative h-6.5 landscape:max-lg:h-5 md:h-10">
        <Gunship orientation="horizontal" class="w-auto h-full" :class="shipVariants({ color: opponentColor, destroyed: gunshipDestroyed })" />
        <ShipSunkIndicator v-if="gunshipDestroyed" :length="2" orientation="horizontal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cva } from 'class-variance-authority'

const { destroyedShips, opponentColor, opponentName } = useGame()

const aircraftCarrierDestroyed = computed(() => {
  return destroyedShips.value.some(
    ship => ship.w === 5 || ship.h === 5,
  )
})

const battleshipDestroyed = computed(() => {
  return destroyedShips.value.some(
    ship => ship.w === 4 || ship.h === 4,
  )
})

const destroyersDestroyed = computed(() => {
  return destroyedShips.value.filter(
    ship => ship.w === 3 || ship.h === 3,
  ).length
})

const gunshipDestroyed = computed(() => {
  return destroyedShips.value.some(
    ship => ship.w === 2 || ship.h === 2,
  )
})

const shipVariants = cva(
  'drop-shadow-(--drop-shadow-shadow) stroke-1 stroke-black active:translate-x-boxShadowX active:translate-y-boxShadowY active:drop-shadow-none',
  {
    defaultVariants: {
      color: 'white',
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
        white: 'fill-white',
      },
      destroyed: {
        true: 'opacity-30',
        false: 'opacity-100',
      },
    },
  },
)
</script>
