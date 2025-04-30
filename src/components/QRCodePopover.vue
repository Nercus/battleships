<template>
  <PopoverRoot>
    <PopoverTrigger as="template">
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverAnchor />
    <PopoverPortal>
      <PopoverContent>
        <slot name="content" />
        <PopoverClose />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
