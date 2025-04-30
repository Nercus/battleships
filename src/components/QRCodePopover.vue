<template>
  <PopoverRoot>
    <PopoverTrigger as="template">
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverAnchor />
    <PopoverPortal>
      <PopoverContent class="z-50 bg-base-100">
        <slot name="content" />
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
