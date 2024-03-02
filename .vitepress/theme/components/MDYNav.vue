<template>
  <div class="MDNav" :class="{ showMenu }"">
    <div class="content">
      <md-icon-button class="logo" @click="clickLogo">
        <img :src="theme.logo" alt="nyanpasu logo" />
      </md-icon-button>

      <md-icon-button class="show-menu" @click="showMenu = !showMenu">
        <span class="material-icons"> menu </span>
      </md-icon-button>

      <span class="title">{{ site.title }}</span>
    </div>

    <div class="content">
      <MDYNavBarTranslate />

      <md-filled-tonal-icon-button
        v-for="item in theme.socialLinks"
        :href="item.link"
        target="_blank"
        v-html="buildSvg(item.icon)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import '@material/web/iconbutton/icon-button.js'
import '@material/web/iconbutton/filled-tonal-icon-button.js'
import type { DefaultTheme } from 'vitepress/theme'
import MDYNavBarTranslate from './MDYNavBarTranslate.vue'

const buildSvg = (icon: DefaultTheme.SocialLinkIcon) => {
  if (typeof icon === 'object') return icon.svg
  return `<span class="vpi-social-${icon}" />`
}

const { site, theme } = useData()

const clickLogo = () => {
  window.location.href = '/'
}

const showMenu = ref(false)

onMounted(() => {
  console.log(site, theme)
})
</script>

<style scoped lang="scss">
.MDNav {
  position: fixed;
  left: 0;
  z-index: var(--vp-z-index-nav);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--vp-nav-height);
  display: flex;
  background-color: var(--md-sys-color-surface);
  padding: 12px 16px;

  .title {
    color: var(--md-sys-color-primary);
    font-size: 16px;
    text-decoration: none;
    padding-inline: 8px;
    position: relative;
    outline: none;
    vertical-align: middle;
    font-weight: 500;
    font-family: 'Google Sans', Roboto, system-ui;
  }

  .content {
    display: flex;
    align-items: center;
    gap: 0 8px;
  }

  .logo {
    display: none;
  }

  &.showMenu {
      padding-left: 28px;
    }
}

@media (min-width: 960px) {
  .MDNav {
    padding-left: 28px;
  }

  .title {
    font-size: 22px;
    padding-inline: 12px;
  }

  .logo {
    display: flex !important;
  }
}
</style>
