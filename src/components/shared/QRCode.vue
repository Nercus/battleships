<template>
  <div ref="qrCanvas" class="rounded-full outline outline-primary w-fit" />
</template>

<script setup lang="ts">
import QRCodeStyling from 'qr-code-styling'

const props = defineProps<{
  data: string
}>()

const qrCanvas = templateRef<HTMLCanvasElement>('qrCanvas')
const qrCode = ref<QRCodeStyling | null>(null)

onMounted(() => {
  qrCode.value = new QRCodeStyling({
    backgroundOptions: {
      color: '#f5f5f5',
    },
    cornersSquareOptions: {
      color: '#3d3d3d',
    },
    data: props.data || '',
    dotsOptions: {
      color: '#000000',
      type: 'rounded',
    },
    height: 500,
    image: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTYwIDE0MFY3Mi44NWE0IDQgMCAwIDEgNy0yLjY5bDU1IDYwLjQ2YTggOCAwIDAgMSAuNDMgMTAuMjZhOC4yNCA4LjI0IDAgMCAxLTYuNTggMy4xMkgxNjRhNCA0IDAgMCAxLTQtNG04Ny4yMSAzMi41M0E4IDggMCAwIDAgMjQwIDE2OGgtOTZWOGE4IDggMCAwIDAtMTQuMjEtNWwtMTA0IDEyOEE4IDggMCAwIDAgMzIgMTQ0aDk2djI0SDE2YTggOCAwIDAgMC02LjI1IDEzbDI5LjYgMzdhMTUuOTMgMTUuOTMgMCAwIDAgMTIuNDkgNmgxNTIuMzJhMTUuOTMgMTUuOTMgMCAwIDAgMTIuNDktNmwyOS42LTM3YTggOCAwIDAgMCAuOTYtOC40NyIvPjwvc3ZnPg==',
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 5,
    },
    shape: 'circle',
    type: 'svg',
    width: 500,
  })
  qrCode.value.append(qrCanvas.value!)
})

watch(() => props.data, (newValue, oldValue) => {
  if (newValue === oldValue) return
  if (newValue === '') return
  if (!qrCode.value) return
  qrCode.value.update({
    data: newValue,
  })
})
</script>
