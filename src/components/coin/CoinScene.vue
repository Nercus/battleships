<template>
  <TresGroup ref="coinGroupRef">
    <TresGroup
      v-for="(geometry, index) in coinBodyGeometries"
      :key="`coin-body-${index}`"
      :position="coinBodyPosition"
      :scale="coinBodyScale">
      <TresMesh :geometry="geometry">
        <TresMeshBasicMaterial color="#f5f5f5" />
      </TresMesh>

      <TresLineSegments>
        <TresEdgesGeometry :args="[geometry]" />
        <TresLineBasicMaterial color="#1a1a1a" :line-width="2" />
      </TresLineSegments>
    </TresGroup>

    <TresMesh :position="frontInsetBorderPosition" :rotation="[Math.PI / 2, 0, 0]">
      <TresCylinderGeometry :args="[insetBorderRadius, insetBorderRadius, insetDepth, coinSegments]" />
      <TresMeshBasicMaterial color="#1a1a1a" />
    </TresMesh>
    <TresMesh :position="frontInsetPosition" :rotation="[Math.PI / 2, 0, 0]">
      <TresCylinderGeometry :args="[insetRadius, insetRadius, insetDepth, coinSegments]" />
      <TresMeshBasicMaterial :color="props.colors[0]" />
    </TresMesh>
    <TresMesh :position="frontInsetLinePosition">
      <TresTorusGeometry :args="[innerInsetRadius, insetLineThickness, 6, coinSegments]" />
      <TresMeshBasicMaterial color="#1a1a1a" />
    </TresMesh>

    <TresMesh v-if="font && props.names && frontTextGeometry" :position="frontTextPosition" :geometry="frontTextGeometry">
      <TresMeshBasicMaterial color="#1a1a1a" />
    </TresMesh>

    <TresMesh :position="backInsetBorderPosition" :rotation="[Math.PI / 2, 0, 0]">
      <TresCylinderGeometry :args="[insetBorderRadius, insetBorderRadius, insetDepth, coinSegments]" />
      <TresMeshBasicMaterial color="#1a1a1a" />
    </TresMesh>
    <TresMesh :position="backInsetPosition" :rotation="[Math.PI / 2, 0, 0]">
      <TresCylinderGeometry :args="[insetRadius, insetRadius, insetDepth, coinSegments]" />
      <TresMeshBasicMaterial :color="props.colors[1]" />
    </TresMesh>
    <TresMesh :position="backInsetLinePosition">
      <TresTorusGeometry :args="[innerInsetRadius, insetLineThickness, 6, coinSegments]" />
      <TresMeshBasicMaterial color="#1a1a1a" />
    </TresMesh>

    <TresMesh
      v-if="font && props.names && backTextGeometry" :position="backTextPosition"
      :rotation="[0, Math.PI, 0]" :geometry="backTextGeometry">
      <TresMeshBasicMaterial color="#1a1a1a" />
    </TresMesh>
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoader, useLoop } from '@tresjs/core'
import { ExtrudeGeometry, Vector3 } from 'three'
import { Font, SVGLoader, TextGeometry, TTFLoader } from 'three/examples/jsm/Addons.js'

const props = defineProps<{
  colors: [string, string]
  names?: [string, string]
  targetSide?: 0 | 1
}>()

const coinSegments = 64
const coinSvgSize = 837
const coinSvgCenter = coinSvgSize / 2
const { state: coinSvgData } = useLoader(SVGLoader, '/assets/Coin.svg')
const coinRadius = computed(() => {
  const baseRadius = 1.0
  const aspectRatio = window.innerWidth / window.innerHeight

  return aspectRatio < 0.8 ? baseRadius * 0.6 : baseRadius
})

const coinThickness = 0.16
const insetDepth = 0.028
const insetLineThickness = 0.008
const faceZOffset = coinThickness / 2
const faceInsetOffset = 0.026
const recessedFaceZOffset = faceZOffset - faceInsetOffset
const coinSvgScale = computed(() => (coinRadius.value * 2) / coinSvgSize)
const coinBodyPosition = computed(() => {
  const scale = coinSvgScale.value
  return new Vector3(-coinSvgCenter * scale, coinSvgCenter * scale, -faceZOffset)
})
const coinBodyScale = computed(() => {
  const scale = coinSvgScale.value
  return new Vector3(scale, -scale, 1)
})
const coinBodyGeometries = computed(() => {
  if (!coinSvgData.value) return []

  return coinSvgData.value.paths.flatMap(path =>
    SVGLoader
      .createShapes(path)
      .map(shape => new ExtrudeGeometry(shape, {
        bevelEnabled: false,
        curveSegments: 10,
        depth: coinThickness,
      })),
  )
})
const insetBorderRadius = computed(() => coinRadius.value * 0.94)
const insetRadius = computed(() => coinRadius.value * 0.88)
const innerInsetRadius = computed(() => coinRadius.value * 0.58)
const frontTextPosition = new Vector3(0, 0, recessedFaceZOffset + 0.002)
const backTextPosition = new Vector3(0, 0, -recessedFaceZOffset - 0.002)
const frontInsetBorderPosition = new Vector3(0, 0, recessedFaceZOffset - insetDepth / 2)
const frontInsetPosition = new Vector3(0, 0, recessedFaceZOffset - insetDepth / 2 + 0.004)
const frontInsetLinePosition = new Vector3(0, 0, recessedFaceZOffset + 0.008)
const backInsetBorderPosition = new Vector3(0, 0, -recessedFaceZOffset + insetDepth / 2)
const backInsetPosition = new Vector3(0, 0, -recessedFaceZOffset + insetDepth / 2 - 0.004)
const backInsetLinePosition = new Vector3(0, 0, -recessedFaceZOffset - 0.008)
const maxTextWidth = computed(() => coinRadius.value * 1.5)

const coinGroupRef = ref()
const font = shallowRef<Font | null>(null)

const frontTextGeometry = shallowRef<TextGeometry | null>(null)
const backTextGeometry = shallowRef<TextGeometry | null>(null)

function createTextGeometry(text: string) {
  if (!font.value) return null
  const geometry = new TextGeometry(text.trim().toUpperCase(), {
    bevelEnabled: false,
    curveSegments: 8,
    depth: 0.018,
    font: font.value,
    size: coinRadius.value * 0.15,
  })

  geometry.computeBoundingBox()
  if (geometry.boundingBox) {
    const centerX = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2
    const centerY = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2
    geometry.translate(-centerX, -centerY, 0)
  }

  return geometry
}

function getTextScale(geometry: TextGeometry | null) {
  if (!geometry?.boundingBox) return 1
  const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
  return Math.min(1, maxTextWidth.value / Math.max(width, 0.001))
}

function updateTextGeometries() {
  if (font.value && props.names) {
    frontTextGeometry.value = createTextGeometry(props.names[0])
    backTextGeometry.value = createTextGeometry(props.names[1])
    const frontScale = getTextScale(frontTextGeometry.value)
    const backScale = getTextScale(backTextGeometry.value)

    frontTextGeometry.value?.scale(frontScale, frontScale, 1)
    backTextGeometry.value?.scale(backScale, backScale, 1)
  }
}

onMounted(async () => {
  try {
    const loader = new TTFLoader()
    const json = await loader.loadAsync('/assets/Lexend-Black.ttf')
    font.value = new Font(json)

    updateTextGeometries()
  }
  catch (error) {
    console.warn('Could not load font, using fallback text rendering:', error)
  }
})

watch(() => props.names, async () => {
  updateTextGeometries()
}, { deep: true })

const isSpinning = ref(false)
const spinProgress = ref(0)
let animationStartTime = 0
const spinDuration = 3000
const baseSpins = 7
const currentTarget = ref<0 | 1 | undefined>(undefined)

watch(() => props.targetSide, (newTarget) => {
  if (newTarget !== undefined && newTarget !== currentTarget.value) {
    currentTarget.value = newTarget
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

  if (isSpinning.value && currentTarget.value !== undefined) {
    const elapsed = Date.now() - animationStartTime
    const progress = Math.min(elapsed / spinDuration, 1)

    if (progress >= 1) {
      const targetRotation = currentTarget.value === 1 ? Math.PI : 0
      coinGroupRef.value.rotation.y = targetRotation
      isSpinning.value = false
    }
    else {
      const easedProgress = easeOutCubic(progress)

      const targetRotation = currentTarget.value === 1 ? Math.PI : 0
      const totalRotation = baseSpins * Math.PI * 2 + targetRotation

      coinGroupRef.value.rotation.y = -easedProgress * totalRotation
    }
  }
  else if (currentTarget.value === undefined) {
    coinGroupRef.value.rotation.y += delta * 0.5
  }
})
</script>
