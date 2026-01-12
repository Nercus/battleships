<template>
  <div class="relative w-fit">
    <input v-model="model" v-bind="$attrs" class="px-2 py-1 border border-gray-300 focus:border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-fit">
    <CommonButton v-if="props.hasCopyButton" class="right-1 absolute inset-y-1" size="small" square :disabled="!isSupported || model?.length === 0" @click="copyToClipboard">
      <Icon class="fluent--copy-20-regular" />
    </CommonButton>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  hasCopyButton?: boolean
  copyFormat?: (value: string) => string
}>(), {
  hasCopyButton: false,
  copyFormat: (value: string) => value,
})

const model = defineModel<string>()

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
    push.success({
      duration: 3000,
      message: 'Text copied to clipboard!',
    })
  }
})
</script>
