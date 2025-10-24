<template>
  <HoverCardRoot>
    <HoverCardTrigger class="top-2 -right-2 absolute flex justify-center items-center bg-base-800 drop-shadow p-2 rounded-full size-8 translate-x-full">
      <Icon class="bg-white size-full fluent--question-16-filled" />
    </HoverCardTrigger>
    <HoverCardPortal>
      <HoverCardContent align="start" class="z-10 bg-white shadow-sm p-3 pl-7 border border-gray-300 rounded-xl max-w-sm">
        <HoverCardArrow />
        <h3 class="mb-2 font-semibold text-lg">
          How to Play
        </h3>
        <ul class="list-disc">
          <li>
            Each player takes turns to attack a cell on their opponent's grid.
          </li>
          <li>
            The goal is to sink all of your opponent's ships before they sink yours.
          </li>
          <li>
            Click on a cell to aim at a position on your opponent's board.
          </li>
          <li>
            Confirm your attack by double clicking the selected cell.
          </li>
          <li>
            A hit is marked with <span class="inline-block"> <GameGridHitIndicator type="hit" :index="-1" class="size-4" /></span>
            and a miss with <span class="inline-block"> <GameGridHitIndicator type="miss" :index="-1" class="size-4" /></span>.
          </li>
        </ul>
      </HoverCardContent>
    </HoverCardPortal>
  </HoverCardRoot>
</template>
