<template>
  <div class="flex flex-col items-center">
    <slot name="header" />
    <GridLabels orientation="horizontal" />
    <div class="flex flex-row">
      <GridLabels orientation="vertical" />
      <div class="relative shadow-shadow p-1 border-2 border-black size-70 md:size-100">
        <slot name="layer1" />
        <slot name="layer2" />
      </div>
      <GridLabels orientation="vertical" />
    </div>
    <GridLabels orientation="horizontal" />
    <slot name="footer" />
  </div>
</template>
