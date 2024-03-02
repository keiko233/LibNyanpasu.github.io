<template>
  <div></div>

  <span style="position: relative">
    <md-filled-tonal-icon-button id="language-menu" @click="showMenu">
      <!-- {{ currentLang.label }} -->
      <span class="material-icons"> language </span>
    </md-filled-tonal-icon-button>

    <md-menu ref="LanguageMenuRef" anchor="language-menu">
      <md-menu-item
        v-for="item in localeLinks"
        @click="changeLanguage(item.link)"
      >
        <div slot="headline">{{ item.text }}</div>
      </md-menu-item>
    </md-menu>
  </span>
</template>

<script setup lang="ts">
import { hashRef } from '../utils/hash'
import { useData } from 'vitepress'

import '@material/web/iconbutton/filled-tonal-icon-button.js'
import '@material/web/button/filled-tonal-button.js'
import '@material/web/menu/menu.js'
import '@material/web/menu/menu-item.js'

const LanguageMenuRef = ref()

const showMenu = () => {
  LanguageMenuRef.value.open = !LanguageMenuRef.value.open
}

const changeLanguage = (link: string) => {
  window.location.href = link
}

function ensureStartingSlash(path: string): string {
  return /^\//.test(path) ? path : `/${path}`
}

function normalizeLink(
  link: string,
  addPath: boolean,
  path: string,
  addExt: boolean
) {
  return addPath
    ? link.replace(/\/$/, '') +
        ensureStartingSlash(
          path
            .replace(/(^|\/)index\.md$/, '$1')
            .replace(/\.md$/, addExt ? '.html' : '')
        )
    : link
}

function useLangs({ removeCurrent = true, correspondingLink = false } = {}) {
  const { site, localeIndex, page, theme } = useData()
  const currentLang = computed(() => ({
    label: site.value.locales[localeIndex.value]?.label,
    link:
      site.value.locales[localeIndex.value]?.link ||
      (localeIndex.value === 'root' ? '/' : `/${localeIndex.value}/`)
  }))

  const localeLinks = computed(() =>
    Object.entries(site.value.locales).flatMap(([key, value]) =>
      removeCurrent && currentLang.value.label === value.label
        ? []
        : {
            text: value.label,
            link:
              normalizeLink(
                value.link || (key === 'root' ? '/' : `/${key}/`),
                theme.value.i18nRouting !== false && correspondingLink,
                page.value.relativePath.slice(
                  currentLang.value.link.length - 1
                ),
                !site.value.cleanUrls
              ) + hashRef.value
          }
    )
  )

  return { localeLinks, currentLang }
}

const { localeLinks, currentLang } = useLangs({ correspondingLink: true })

onMounted(() => {
  console.log(localeLinks, currentLang)
})
</script>
