<template>
  <div class="flex landscape:max-lg:flex-row flex-col items-center">
    <div class="flex flex-col items-center">
      <slot name="header" />
      <GridLabels orientation="horizontal" />
      <div class="flex flex-row">
        <GridLabels orientation="vertical" />
        <div class="relative shadow-shadow border-2 border-black size-80 landscape:max-lg:size-60 md:size-100">
          <slot name="layer1" />
          <slot name="layer2" />
        </div>
        <GridLabels orientation="vertical" />
      </div>
      <GridLabels orientation="horizontal" />
    </div>
    <slot name="footer" />
  </div>
</template>
