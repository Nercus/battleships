<template>
  <div class="flex flex-col justify-center items-center gap-4 size-full">
    <div class="relative flex flex-row justify-center items-center w-full h-96 md:h-fit overflow-hidden md:overflow-visible">
      <PlayerTurnGrid />
      <Separator class="hidden md:block bg-base-700 mx-2 w-px h-full" orientation="vertical" />
      <OpponentTurnGrid />
    </div>
    <PlayToolbar class="mb-4" />
  </div>
</template>
