<template>
  <TresGroup ref="logoGroupRef">
    <TresGroup :position="frontLogoPosition" :scale="logoScale">
      <TresMesh v-for="(geometry, index) in frontLogoGeometries" :key="`front-logo-${index}`" :geometry="geometry">
        <TresMeshBasicMaterial color="#f5f5f5" :side="DoubleSide" />
      </TresMesh>
    </TresGroup>

    <TresGroup :position="middleLogoPosition" :scale="logoScale">
      <TresMesh v-for="(geometry, index) in middleLogoGeometries" :key="`middle-logo-${index}`" :geometry="geometry">
        <TresMeshBasicMaterial color="#1a1a1a" :side="DoubleSide" />
      </TresMesh>
    </TresGroup>

    <TresGroup :position="backLogoPosition" :scale="logoScale">
      <TresMesh v-for="(geometry, index) in backLogoGeometries" :key="`back-logo-${index}`" :geometry="geometry">
        <TresMeshBasicMaterial color="#f5f5f5" :side="DoubleSide" />
      </TresMesh>
    </TresGroup>
  </TresGroup>
</template>

<script setup lang="ts">
import { useLoader, useLoop } from '@tresjs/core'
import { DoubleSide, ExtrudeGeometry, Vector3 } from 'three'
import { SVGLoader } from 'three/examples/jsm/Addons.js'

const { state: svgData } = useLoader(SVGLoader, '/assets/logo.svg')
const whiteLayerDepth = 0.045
const blackLayerDepth = 0.03
const logoPosition = new Vector3(-0.75, 0.75, -0.05)
const logoScale = new Vector3(0.003, -0.003, 1)
const frontLogoPosition = new Vector3(logoPosition.x, logoPosition.y, blackLayerDepth / 2)
const middleLogoPosition = new Vector3(logoPosition.x, logoPosition.y, -blackLayerDepth / 2)
const backLogoPosition = new Vector3(logoPosition.x, logoPosition.y, -blackLayerDepth / 2 - whiteLayerDepth)

const logoShapes = computed(() => {
  if (!svgData.value) return []

  return svgData.value.paths.flatMap(path =>
    SVGLoader.createShapes(path),
  )
})

const frontLogoGeometries = computed(() =>
  createLogoGeometries(whiteLayerDepth),
)

const middleLogoGeometries = computed(() =>
  createLogoGeometries(blackLayerDepth),
)

const backLogoGeometries = computed(() =>
  createLogoGeometries(whiteLayerDepth),
)

function createLogoGeometries(depth: number) {
  return logoShapes.value.map(shape => new ExtrudeGeometry(shape, {
    bevelEnabled: false,
    curveSegments: 10,
    depth,
  }))
}

const logoGroupRef = ref()

const { onBeforeRender } = useLoop()
const preferredMotion = usePreferredReducedMotion()

onBeforeRender(({ delta }) => {
  if (!logoGroupRef.value) return
  if (preferredMotion.value === 'reduce') return
  logoGroupRef.value.rotation.y += delta * 0.5
})
</script>
