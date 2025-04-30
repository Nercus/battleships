<template>
  <PopoverRoot>
    <PopoverTrigger as="template">
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverAnchor />
    <PopoverPortal>
      <PopoverContent class="bg-base-200">
        <slot name="content" />
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
