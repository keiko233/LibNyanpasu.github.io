<script setup lang="ts">
// https://vitepress.dev/guide/extending-default-theme#layout-slots
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme
} from '@material/material-color-utilities'

// 切换 夜间 / 日间 模式
const { isDark } = useData()
function enableTransitions() {
  return (
    'startViewTransition' in document &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches
  )
}

provide('toggle-appearance', async ({ clientX: x, clientY: y }: MouseEvent) => {
  if (!enableTransitions()) {
    isDark.value = !isDark.value
    return
  }

  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    )}px at ${x}px ${y}px)`
  ]

  // @ts-ignore:ts(2339)
  await document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  }).ready

  document.documentElement.animate(
    { clipPath: isDark.value ? clipPath.reverse() : clipPath },
    {
      duration: 300,
      easing: 'ease-in',
      pseudoElement: `::view-transition-${isDark.value ? 'old' : 'new'}(root)`
    }
  )
})

const injectMDTheme = () => {
  applyTheme(
    themeFromSourceColor(argbFromHex('#2DACBE'), [
      {
        name: 'Default',
        value: argbFromHex('#2DACBE'),
        blend: true
      }
    ]),
    { target: document.body, dark: isDark.value }
  )
}

watch(
  () => isDark.value,
  () => injectMDTheme()
)

onBeforeMount(() => {
  injectMDTheme()
})
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <BackToTop />
      <UnoCSSIndicator />
    </template>
  </DefaultTheme.Layout>
</template>

<style lang="scss">
::view-transition-old(root),
::view-transition-new(root) {
  mix-blend-mode: normal;
  animation: none;
}

::view-transition-old(root),
.dark::view-transition-new(root) {
  z-index: 1;
}

::view-transition-new(root),
.dark::view-transition-old(root) {
  z-index: 9999;
}

.VPSwitchAppearance {
  width: 22px !important;
}

.VPSwitchAppearance .check {
  transform: none !important;
}
</style>
