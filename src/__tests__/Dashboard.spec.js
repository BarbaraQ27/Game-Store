import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import DashboardView from '@/views/DashboardView.vue'

// Router con las rutas nombradas que usa DashboardView con componentes vacios (template con un div X) para que no cargue vistas asociadas reales
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'main', component: { template: '<div />' } },
    { path: '/login', name: 'login', component: { template: '<div />' } },
    {
      path: '/dashboard', name: 'dashboard', component: { template: '<div />' },
      children: [
        { path: '', name: 'Home', component: { template: '<div />' } },
        { path: 'store', name: 'Store', component: { template: '<div />' } },
        { path: 'wishlist', name: 'Wishlist', component: { template: '<div />' } },
        { path: 'mygames', name: 'MyGames', component: { template: '<div />' } },
      ],
    },
  ],
})

const wrapper = mount(DashboardView, {
  global: {
    plugins: [router, createPinia()],
    stubs: {
      // Stubs de componentes hijos que harian fetches o necesitan contexto extra
      SearchBar: true,
      CartDrawer: true,
      RouterView: true,
      ButtonAnimationSmall: true,
    },
  },
})

//test de verificacion de textos en dashboard (titulo y enlaces a vistas)

describe('DashboardView', () => {

  it('muestra el titulo GAME STORE', () => {
    expect(wrapper.text()).toContain('GAME STORE')
  })

  it('muestra el enlace Principal', () => {
    expect(wrapper.text()).toContain('Principal')
  })

  it('muestra el enlace Tienda', () => {
    expect(wrapper.text()).toContain('Tienda')
  })

  it('muestra el enlace Lista de deseados', () => {
    expect(wrapper.text()).toContain('Lista de deseados')
  })

  it('muestra el enlace Mis juegos', () => {
    expect(wrapper.text()).toContain('Mis juegos')
  })

})
