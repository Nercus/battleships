<template>
  <TresPerspectiveCamera :position="[0, 1, 3.5]" :look-at="[0, 0, 0]" />
  <TresDirectionalLight :position="[5, 5, 5]" :intensity="0.3" />

  <TresMesh :position="[0, -radius - 0.05, 0]" :rotation="[-Math.PI / 2, 0, 0]">
    <TresPlaneGeometry :args="[radius * 2, radius * 2]" />
    <TresMeshBasicMaterial :map="shadowTexture" :transparent="true" :depth-write="false" />
  </TresMesh>

  <TresGroup ref="coinGroupRef">
    <TresGroup v-for="(shape, index) in logoShapes" :key="`shape-${index}`">
      <TresMesh :position="[-0.75, 0.75, 0]" :scale="[0.003, -0.003, 1]">
        <TresExtrudeGeometry :args="[shape, { depth: 0.1, bevelEnabled: false }]" />
        <TresMeshBasicMaterial color="#8baee9" />
      </TresMesh>

      <TresLineSegments :position="[-0.75, 0.75, 0]" :scale="[0.003, -0.003, 1]">
        <TresEdgesGeometry :args="[new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false })]" />
        <TresLineBasicMaterial color="#000000" :line-width="2" />
      </TresLineSegments>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoader, useLoop } from '@tresjs/core'
import { CanvasTexture, ExtrudeGeometry } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'

const radius = computed(() => {
  const baseRadius = 1.0
  const aspectRatio = window.innerWidth / window.innerHeight

  return aspectRatio < 0.8 ? baseRadius * 0.6 : baseRadius
})

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
  gradient.addColorStop(0, 'rgba(0,0,0,0.3)')
  gradient.addColorStop(0.7, 'rgba(0,0,0,0.05)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return new CanvasTexture(canvas)
}

const shadowTexture = createShadowTexture()

const { state: svgData } = await useLoader(SVGLoader, '/src/assets/logo.svg')

const logoShapes = computed(() => {
  if (!svgData.value) return []

  const shapes = []
  const paths = svgData.value.paths

  for (let i = 0; i < paths.length; i++) {
    const path = paths[i]
    const pathShapes = SVGLoader.createShapes(path)

    for (let j = 0; j < pathShapes.length; j++) {
      shapes.push(pathShapes[j])
    }
  }

  return shapes
})

const coinGroupRef = ref()

const { onBeforeRender } = useLoop()

onBeforeRender(({ delta }) => {
  if (!coinGroupRef.value) return

  coinGroupRef.value.rotation.y += delta
})
</script>
