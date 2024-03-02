// https://vitepress.dev/guide/custom-theme
/// <reference types="vite/client" />

import { useData, type Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'

import Layout from './Layout.vue'
import NotFound from './NotFound.vue'

import './styles/main.scss'

import 'virtual:uno.css'

import 'material-design-icons-iconfont/dist/material-design-icons.css'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: () => h(Layout),
  NotFound,
  enhanceApp: (_ctx) => {}
} satisfies Theme

export default theme
