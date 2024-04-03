// https://vitepress.dev/guide/custom-theme
/// <reference types="vite/client" />

import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'

import './styles/main.scss'

import 'virtual:uno.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  ssr: true
})

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => h(Layout),
  NotFound,
  enhanceApp: ({ app }) => {
    app.use(vuetify)
  }
} satisfies Theme

export default theme
