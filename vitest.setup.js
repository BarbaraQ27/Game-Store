import { config } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// jsdom no incluye ResizeObserver — Vuetify lo necesita en VApp y VNavigationDrawer.
// Este polyfill mínimo evita el error sin afectar la lógica de los tests.
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
}


// Registra Vuetify globalmente en todos los tests
// así no hay que repetirlo en cada archivo .spec.js
const vuetify = createVuetify({ components, directives })

config.global.plugins = [vuetify]
