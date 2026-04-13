<template>
  <v-responsive class="border rounded">
    <!-- Fondo dinamico que solo aparece en GameDetail -->
    <transition name="bg-fade">
      <div
        v-if="store.backgroundImage"
        class="dynamic-bg"
        :style="{ backgroundImage: `url(${store.backgroundImage})` }"
      ></div>
    </transition>

    <v-app class="dash">
      <v-navigation-drawer>
        <v-list>
          <v-list-item
            lines="two"
            prepend-avatar="https://randomuser.me/api/portraits/women/81.jpg"
            subtitle="Conectado"
            title="Bienvenido"
          ></v-list-item>

          <v-divider></v-divider>
          <v-list density="default" nav>
            <v-list-item prepend-icon="mdi-home-city" title="Principal" :to="{ name: 'Home' }" />
            <v-list-item prepend-icon="mdi-cart" title="Tienda" :to="{ name: 'Store' }" />
            <v-list-item
              prepend-icon="mdi-cards-heart"
              title="Lista de deseados"
              :to="{ name: 'Wishlist' }"
            />
          </v-list>
          <v-divider></v-divider>
          <v-list density="default" nav>
            <v-list-item
              prepend-icon="mdi-controller-classic"
              title="Mis juegos"
              :to="{ name: 'MyGames' }"
            />
          </v-list>
          <div class="logout"><ButtonAnimationSmall btnText="Salir" to="/" /></div>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar title="GAME STORE">
        <SearchBar @search="store.search" />
        <template #append>
          <v-btn icon @click="cart.openCart">
            <v-badge v-if="cart.totalItems" :content="cart.totalItems" color="purple">
              <v-icon icon="mdi-cart" />
            </v-badge>
            <v-icon v-else icon="mdi-cart" />
          </v-btn>
        </template>
      </v-app-bar>

      <CartDrawer />

      <v-main>
        <router-view></router-view>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'
import { useCartStore } from '@/stores/cartStore'
import SearchBar from '@/components/SearchBar.vue'
import CartDrawer from '@/components/CartDrawer.vue'
import ButtonAnimationSmall from '@/components/ButtonAnimationSmall.vue'

const store = useGameStore()
const cart = useCartStore()
const route = useRoute()

onMounted(() => store.fetchGames())

// Limpia el fondo al salir de GameDetail
watch(
  () => route.name,
  (name) => {
    if (name !== 'GameDetail') store.clearBackground()
  },
)
</script>

<style scoped>
.dash {
  background: url('/character.jpg') center/cover no-repeat;
}
.v-list-item {
  text-decoration: none;
  color: beige;
}
.v-navigation-drawer {
  opacity: 0.8;
  box-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 5px #fff,
    0 0 10px #0ff,
    0 0 20px #0ff,
    0 0 30px #0ff;
}
.v-app-bar {
  opacity: 0.9;
  color: rgb(127, 208, 255);
  font-size: x-large;
  box-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 5px #fff,
    0 0 10px #0ff,
    0 0 20px #0ff,
    0 0 30px #0ff;
}

/* Fondo dinámico — detrás de todo el contenido */
.dynamic-bg {
  position: fixed;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 0;
  /* Oscurece la imagen para que el contenido sea legible */
  filter: brightness(0.35) blur(3px);
  transform: scale(1.05); /* evita bordes blancos por el blur */
}

/* Transición suave al entrar/salir */
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.6s ease;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}
.logout {
  margin: 50vh 0 0 -3vw;
}
</style>
