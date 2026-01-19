<template>
  <TresGroup ref="coinGroupRef">
    <TresMesh :rotation="[Math.PI / 2, 0, 0]">
      <TresCylinderGeometry :args="[coinRadius, coinRadius, coinThickness, 64]" />
      <TresMeshBasicMaterial color="#f5f5f5" />
    </TresMesh>

    <TresLineSegments :rotation="[Math.PI / 2, 0, 0]">
      <TresEdgesGeometry :args="[cylinderGeometry]" />
      <TresLineBasicMaterial color="#000000" :line-width="3" />
    </TresLineSegments>

    <TresMesh v-if="font && props.names && frontTextGeometry" :position="[0, 0, faceZOffset + 0.02]" :geometry="frontTextGeometry">
      <TresMeshBasicMaterial :color="props.colors[0]" />
    </TresMesh>

    <!-- Front text outline -->
    <TresLineSegments v-if="font && props.names && frontTextGeometry" :position="[0, 0, faceZOffset + 0.02]">
      <TresEdgesGeometry :args="[frontTextGeometry]" />
      <TresLineBasicMaterial color="#000000" :line-width="2" />
    </TresLineSegments>

    <TresMesh :position="[0, 0, faceZOffset]">
      <TresExtrudeGeometry :args="[ringShape, { depth: 0.025, bevelEnabled: false, curveSegments: 64 }]" />
      <TresMeshBasicMaterial :color="props.colors[0]" />
    </TresMesh>
    <TresLineSegments :position="[0, 0, faceZOffset]">
      <TresEdgesGeometry :args="[frontRingGeometry]" />
      <TresLineBasicMaterial color="#000000" :line-width="2" />
    </TresLineSegments>

    <TresMesh
      v-if="font && props.names && backTextGeometry" :position="[0, 0, -faceZOffset - 0.02]"
      :rotation="[0, Math.PI, 0]" :geometry="backTextGeometry">
      <TresMeshBasicMaterial :color="props.colors[1]" />
    </TresMesh>

    <TresLineSegments
      v-if="font && props.names && backTextGeometry" :position="[0, 0, -faceZOffset - 0.02]"
      :rotation="[0, Math.PI, 0]">
      <TresEdgesGeometry :args="[backTextGeometry]" />
      <TresLineBasicMaterial color="#000000" :line-width="2" />
    </TresLineSegments>

    <TresMesh :position="[0, 0, -faceZOffset - 0.025]">
      <TresExtrudeGeometry :args="[ringShape, { depth: 0.025, bevelEnabled: false, curveSegments: 64 }]" />
      <TresMeshBasicMaterial :color="props.colors[1]" />
    </TresMesh>

    <TresLineSegments :position="[0, 0, -faceZOffset - 0.025]">
      <TresEdgesGeometry :args="[backRingGeometry]" />
      <TresLineBasicMaterial color="#000000" :line-width="2" />
    </TresLineSegments>
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoop, useTres } from '@tresjs/core'
import { CylinderGeometry, ExtrudeGeometry, Shape } from 'three'
import { Font, TextGeometry, TTFLoader } from 'three/examples/jsm/Addons.js'

const props = defineProps<{
  colors: [string, string]
  names?: [string, string]
  targetSide?: 0 | 1
}>()
const { extend } = useTres()
extend({ TextGeometry })

const coinRadius = computed(() => {
  const baseRadius = 1.0
  const aspectRatio = window.innerWidth / window.innerHeight

  return aspectRatio < 0.8 ? baseRadius * 0.6 : baseRadius
})

const ringShape = computed(() => {
  const shape = new Shape()
  const outerRadius = coinRadius.value * 0.98
  const innerRadius = coinRadius.value * 0.95

  shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)

  const hole = new Shape()
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
  shape.holes.push(hole)

  return shape
})

const coinThickness = 0.12
const faceZOffset = coinThickness / 2

const coinGroupRef = ref()
const font = ref<Font | null>(null)

const cylinderGeometry = shallowRef()
const frontRingGeometry = shallowRef()
const backRingGeometry = shallowRef()

watch([coinRadius], () => {
  cylinderGeometry.value = new CylinderGeometry(coinRadius.value, coinRadius.value, coinThickness, 64)
}, { immediate: true })

watch(ringShape, () => {
  frontRingGeometry.value = new ExtrudeGeometry(ringShape.value, { depth: 0.025, bevelEnabled: false, curveSegments: 64 })
  backRingGeometry.value = new ExtrudeGeometry(ringShape.value, { depth: 0.025, bevelEnabled: false, curveSegments: 64 })
}, { immediate: true })

const frontTextGeometry = shallowRef<TextGeometry | null>(null)
const backTextGeometry = shallowRef<TextGeometry | null>(null)

function createTextGeometry(text: string) {
  if (!font.value) return null
  const geometry = new TextGeometry(text, { font: font.value, size: 0.1, depth: 0.025 })

  geometry.computeBoundingBox()
  if (geometry.boundingBox) {
    const centerX = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2
    const centerY = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2
    geometry.translate(-centerX, -centerY, 0)
  }

  return geometry
}

function updateTextGeometries() {
  if (font.value && props.names) {
    frontTextGeometry.value = createTextGeometry(props.names[0])
    backTextGeometry.value = createTextGeometry(props.names[1])
  }
}

onMounted(async () => {
  try {
    const loader = new TTFLoader()
    const json = await loader.loadAsync('../../src/assets/LexendMega.ttf')
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
