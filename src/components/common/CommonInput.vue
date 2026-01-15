<template>
  <div class="relative flex flex-col w-fit">
    <label v-if="props.label" :for="id" class="text-xs text-base-700 italic">
      {{ props.label }}
    </label>
    <input :id="id" v-model="model" v-bind="$attrs" class="flex bg-base-100 selection:bg-primary file:bg-transparent disabled:opacity-50 px-3 py-2 border-2 border-black file:border-0 rounded-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 w-full h-11 font-base file:font-heading text-sm file:text-sm text-base-900 selection:text-base-900 placeholder:text-base-900/50 disabled:cursor-not-allowed">
    <CommonButton v-if="props.hasCopyButton" class="top-1 right-2 bottom-2 absolute" size="icon" :disabled="!isSupported || model?.length === 0" @click="copyToClipboard">
      <Icon class="fluent--copy-20-filled" />
    </CommonButton>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  hasCopyButton?: boolean
  copyFormat?: (value: string) => string
  label?: string
}>(), {
  hasCopyButton: false,
  copyFormat: (value: string) => value,
})

const id = useId()
const model = defineModel<string | null>()

const { copied, copy, isSupported } = useClipboard({
  legacy: true,
})

function copyToClipboard() {
  if (model.value) {
    copy(props.copyFormat ? props.copyFormat(model.value) : model.value)
  }
}

watch(copied, (newValue) => {
  if (newValue) {
    push.info({
      duration: 3000,
      message: 'Text copied to clipboard!',
    })
  }
})
</script>
