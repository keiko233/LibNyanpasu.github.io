<template>
  <aside class="VPSidebar" :class="{ open }">
    <div class="context">
      <MDYSidebarItem icon="home" href="/" :selected="router.route.path == '/'">
        Home
      </MDYSidebarItem>

      <MDYSidebarItem
        v-for="item in sidebarGroups"
        icon="format_list_bulleted"
        :selected="getSelectedStatus(item.items)"
        @mouseover="sideboxEvent.onMouseover(item.items)"
      >
        {{ item.text }}
      </MDYSidebarItem>
    </div>
  </aside>

  <div
    class="sidebox"
    :class="throttledSideboxShow ? 'sideboxShow' : ''"
    @mouseleave="sideboxEvent.onMouseleave()"
  >
    <md-list>
      <md-list-item
        v-for="item in sideboxRenderList"
        class="list-item"
        :href="item.link"
        type="button"
      >
        {{ item.text }}
      </md-list-item>
    </md-list>
  </div>
</template>

<script setup lang="ts">
// import '@material/web/button/text-button.js'
import MDYSidebarItem from './MDYSidebarItem.vue'
import { useData, useRouter } from 'vitepress'
import type { DefaultTheme } from 'vitepress/theme'
import { refThrottled } from '@vueuse/core'

import '@material/web/divider/divider.js'
import '@material/web/list/list.js'
import '@material/web/list/list-item.js'

const props = defineProps<{
  open: boolean
}>()

const router = useRouter()

const { frontmatter, page, theme } = useData()

function addBase(
  items: DefaultTheme.SidebarItem[],
  _base?: string
): DefaultTheme.SidebarItem[] {
  return [...items].map((_item) => {
    const item = { ..._item }
    const base = item.base || _base
    if (base && item.link) item.link = base + item.link
    if (item.items) item.items = addBase(item.items, base)
    return item
  })
}

function ensureStartingSlash(path: string): string {
  return /^\//.test(path) ? path : `/${path}`
}

function getSidebar(
  _sidebar: DefaultTheme.Sidebar | undefined,
  path: string
): DefaultTheme.SidebarItem[] {
  if (Array.isArray(_sidebar)) return addBase(_sidebar)
  if (_sidebar == null) return []

  path = ensureStartingSlash(path)

  const dir = Object.keys(_sidebar)
    .sort((a, b) => {
      return b.split('/').length - a.split('/').length
    })
    .find((dir) => {
      // make sure the multi sidebar key starts with slash too
      return path.startsWith(ensureStartingSlash(dir))
    })

  const sidebar = dir ? _sidebar[dir] : []
  return Array.isArray(sidebar)
    ? addBase(sidebar)
    : addBase(sidebar.items, sidebar.base)
}

const _sidebar = computed(() => {
  const sidebarConfig = theme.value.sidebar
  const relativePath = page.value.relativePath
  return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : []
})

const sidebar = ref(_sidebar.value)

watch(_sidebar, (next, prev) => {
  if (JSON.stringify(next) !== JSON.stringify(prev))
    sidebar.value = _sidebar.value
})

function getSidebarGroups(
  sidebar: DefaultTheme.SidebarItem[]
): DefaultTheme.SidebarItem[] {
  const groups: DefaultTheme.SidebarItem[] = []

  let lastGroupIndex: number = 0

  for (const index in sidebar) {
    const item = sidebar[index]

    if (item.items) {
      lastGroupIndex = groups.push(item)
      continue
    }

    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] })
    }

    groups[lastGroupIndex]!.items!.push(item)
  }

  return groups
}

const sidebarGroups = computed(() => {
  return getSidebarGroups(sidebar.value) || []
})

const getSelectedStatus = (items: DefaultTheme.SidebarItem[] | undefined) => {
  if (!items) {
    return false
  }

  const link = router.route.path.replace('.html', '')

  if (link == '/') {
    return false
  }

  return items.some((item) => item.link && item.link.includes(link))
}

const sideboxRenderList = ref<DefaultTheme.SidebarItem[]>()

const sideboxShow = ref(false)

const throttledSideboxShow = refThrottled(sideboxShow, 300)

const sideboxEvent = {
  onMouseover: (items: DefaultTheme.SidebarItem[] | undefined) => {
    sideboxRenderList.value = items
    sideboxShow.value = true
  },
  onMouseleave: () => {
    sideboxShow.value = false
  }
}

onMounted(() => {
  console.log(sidebarGroups.value)
})
</script>

<style lang="scss">
:root {
  --vp-sidebar-width: 98px;
}
</style>

<style scoped lang="scss">
.VPSidebar {
  position: fixed;
  top: var(--vp-layout-top-height, 0px);
  bottom: 0;
  left: 0;
  z-index: calc(var(--vp-z-index-sidebar) + 1);
  padding: 8px 8px 96px;
  width: calc(100vw - 64px);
  max-width: 320px;
  background-color: var(--md-sys-color-surface);
  opacity: 0;
  box-shadow: var(--vp-c-shadow-3);
  overflow-x: hidden;
  overflow-y: auto;
  transform: translateX(-100%);
  transition:
    opacity 0.5s,
    transform 0.25s ease;
  overscroll-behavior: contain;

  .context {
    width: 100%;
    display: grid;
    gap: 12px;
  }
}

.nav-item {
  width: 100%;
  text-align: left;
}

.sidebox {
  position: fixed;
  top: var(--vp-nav-height);
  left: var(--vp-sidebar-width);
  z-index: var(--vp-z-index-sidebar);
  padding: 8px 8px 96px;
  background-color: var(--md-sys-color-surface);
  height: calc(100% - var(--vp-nav-height));
  width: 240px;
  opacity: 0;
  display: none;
  border-left: solid 0.6px var(--md-sys-color-outline-variant);
  border-radius: 0 28px 28px 0;
  box-shadow:
    0px 1px 3px 0px rgb(0 0 0 / 30%),
    0px 4px 8px 3px rgb(0 0 0 / 15%);
  transform: translateX(-105%);
  transition: all 0.3s;

  .list-item {
    border-radius: 28px;
  }

  &.sideboxShow {
    transform: translateX(0);
  }
}

@media (min-width: 960px) {
  .VPSidebar {
    top: var(--vp-nav-height);
    width: var(--vp-sidebar-width);
    max-width: 100%;
    opacity: 1;
    visibility: visible;
    box-shadow: none;
    transform: translateX(0);
  }

  .sidebox {
    display: block;
    opacity: 1;
  }
}
</style>
