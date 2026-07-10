<template>
  <TresGroup ref="coinGroupRef">
    <TresGroup v-for="(shape, index) in logoShapes" :key="`shape-${index}`">
      <TresMesh :position="logoPosition" :scale="logoScale">
        <TresExtrudeGeometry :args="[shape, { depth: 0.1, bevelEnabled: false }]" />
        <TresMeshBasicMaterial color="white" />
      </TresMesh>

      <TresLineSegments :position="logoPosition" :scale="logoScale">
        <TresEdgesGeometry :args="[new ExtrudeGeometry(shape, { depth: 0.1, bevelEnabled: false })]" />
        <TresLineBasicMaterial color="black" />
      </TresLineSegments>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoader, useLoop } from '@tresjs/core'
import { ExtrudeGeometry, Vector3 } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'

const { state: svgData } = useLoader(SVGLoader, '/assets/logo.svg')
const logoPosition = new Vector3(-0.75, 0.75, -0.05)
const logoScale = new Vector3(0.003, -0.003, 1)

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
const preferredMotion = usePreferredReducedMotion()

onBeforeRender(({ delta }) => {
  if (!coinGroupRef.value) return
  if (preferredMotion.value === 'reduce') return
  coinGroupRef.value.rotation.y += delta
})
</script>
