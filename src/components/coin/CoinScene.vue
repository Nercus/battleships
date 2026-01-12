<template>
  <TresPerspectiveCamera :position="[0, 1, 3.5]" :look-at="[0, 0, 0]" />
  <TresDirectionalLight :position="[5, 5, 5]" :intensity="0.7" />

  <TresMesh :position="[0, -coinRadius - 0.05, 0]" :rotation="[-Math.PI / 2, 0, 0]">
    <TresPlaneGeometry :args="[coinRadius * 2, coinRadius * 2]" />
    <TresMeshBasicMaterial :map="shadowTexture" :transparent="true" :depth-write="false" />
  </TresMesh>

  <TresGroup ref="coinGroupRef">
    <TresMesh :position="[0, 0, faceZOffset + 0.01]">
      <TresCircleGeometry :args="[coinRadius * 0.95, 64]" />
      <TresMeshBasicMaterial :map="frontTexture" />
    </TresMesh>

    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresCylinderGeometry :args="[coinRadius, coinRadius, coinThickness, 64]" />
      <TresMeshPhongMaterial color="#f5f5f5" :shininess="70" :specular="0x111111" />
    </TresMesh>

    <TresMesh :position="[0, 0, -faceZOffset - 0.01]" :rotation="[Math.PI, 0, Math.PI]">
      <TresCircleGeometry :args="[coinRadius * 0.95, 64]" />
      <TresMeshBasicMaterial :map="backTexture" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoop } from '@tresjs/core'
import { CanvasTexture } from 'three'

const props = defineProps<{
  colors: [string, string]
  names?: [string, string]
  targetSide?: 'front' | 'back'
  showLogo?: boolean
}>()

const coinRadius = 1.0
const coinThickness = 0.12
const faceZOffset = coinThickness / 2

const coinGroupRef = ref()

function createFaceTexture(text: string, color: string, size = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#1a1a1a'
  ctx.fillRect(0, 0, size, size)

  // Add subtle border
  ctx.strokeStyle = color
  ctx.lineWidth = 8
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2)
  ctx.stroke()

  if (props.showLogo) {
    const logo = new Image()
    logo.src = 'src/assets/logo.png'

    // Set fill color for SVG
    ctx.fillStyle = color

    const texture = new CanvasTexture(canvas)

    logo.onload = () => {
      const logoSize = size * 0.6
      ctx.drawImage(logo, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize)
      texture.needsUpdate = true // Update the texture after logo loads
    }

    return texture
  }

  // Draw text with shadow
  ctx.shadowColor = 'rgba(0,0,0,0.5)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetY = 2

  ctx.fillStyle = color
  ctx.font = `bold ${size / 7}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, size / 2, size / 2)

  return new CanvasTexture(canvas)
}

function createShadowTexture(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0.4)')
  gradient.addColorStop(0.7, 'rgba(0,0,0,0.1)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return new CanvasTexture(canvas)
}

const shadowTexture = createShadowTexture()

const faceNames = computed(() => {
  if (props.names) return props.names
  return props.showLogo ? ['logo', 'logo'] : ['Front', 'Back']
})

const frontTexture = computed(() => createFaceTexture(faceNames.value[0] || 'logo', props.colors[0]))
const backTexture = computed(() => createFaceTexture(faceNames.value[1] || 'logo', props.colors[1]))

const isSpinning = ref(false)
const spinProgress = ref(0)
const spinDuration = 3000 // 3 seconds
let animationStartTime = 0

watch(() => props.targetSide, (newTarget) => {
  if (newTarget && !isSpinning.value) {
    startSpinAnimation()
  }
}, { immediate: true })

function startSpinAnimation() {
  isSpinning.value = true
  spinProgress.value = 0
  animationStartTime = Date.now()
}

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3
}

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  if (!coinGroupRef.value) return

  if (isSpinning.value && props.targetSide) {
    const elapsed = Date.now() - animationStartTime
    const progress = Math.min(elapsed / spinDuration, 1)

    if (progress >= 1) {
      // Animation complete - set final position
      const targetRotation = props.targetSide === 'back' ? Math.PI : 0
      coinGroupRef.value.rotation.y = targetRotation
      isSpinning.value = false
    }
    else {
      // Calculate eased progress for deceleration
      const easedProgress = easeOutCubic(progress)

      // Total rotations: multiple spins + final position
      const baseSpins = 4 // Number of full rotations
      const targetRotation = props.targetSide === 'back' ? Math.PI : 0
      const totalRotation = baseSpins * Math.PI * 2 + targetRotation

      coinGroupRef.value.rotation.y = easedProgress * totalRotation
    }
  }
  else if (!props.targetSide) {
    // Default gentle rotation when no target
    coinGroupRef.value.rotation.y += delta
  }
})
</script>
