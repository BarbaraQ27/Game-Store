<template>
  <div class="p-4 max-w-3xl mx-auto detail-wrap">
    <button @click="handleBack" class="back-btn">← Volver</button>

    <div v-if="store.loadingDetail" class="status">Cargando juego...</div>
    <div v-else-if="store.error" class="status error">{{ store.error }}</div>

    <div v-else-if="store.currentGame" class="game-content">
      <div class="header-row">
        <h1>{{ store.currentGame.name }}</h1>
        <!-- Boton toggle pregunta si esta en la wishlist y alterna entre En wishlist y agregar -->
        <button
          @click="store.toggleWishlist(store.currentGame)"
          :class="['wishlist-btn', { active: inWishlist }]"
        >
          {{ inWishlist ? '★ En wishlist' : '☆ Agregar a wishlist' }}
        </button>
      </div>

      <p class="meta">Lanzamiento: {{ store.currentGame.released || 'Desconocido' }}</p>
      <p class="rating">⭐ {{ store.currentGame.rating }}</p>
      <!-- Fetch de la data "descripcion" del juego -->
      <div v-html="store.currentGame.description" class="description"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'

const route = useRoute()
const router = useRouter()
const store = useGameStore()

//Computa si esta en la wishlist o no desde la store global
const inWishlist = computed(() => store.isInWishlist(store.currentGame?.id))
// Toma los datos de la funcion GameDetails para asociar la ruta con parametros (si coincide el id entonces muestra el slug en URL)
onMounted(() => store.fetchGameDetail(route.params.id ?? route.params.slug))

// Limpia el fondo al salir del detalle
onUnmounted(() => store.clearBackground())

function handleBack() {
  store.clearBackground()
  router.back()
}
</script>

<style scoped>
.detail-wrap {
  position: relative;
  z-index: 1; /* sobre el fondo dinámico */
}
.back-btn {
  margin-bottom: 16px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  color: #fff;
  backdrop-filter: blur(4px);
}
.back-btn:hover {
  background: rgba(81, 47, 109, 0.25);
}

.status {
  text-align: center;
  padding: 42px;
  color: #aaa;
}
.status.error {
  color: #e74c3c;
}

.cover {
  width: 100%;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}
h1 {
  color: #fff;
  margin: 0;
  text-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 50px #fff,
    0 0 10px #0ff,
    0 0 20px #0ff,
    0 0 30px #0ff;
}

.wishlist-btn {
  padding: 7px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: rgba(52, 152, 219, 0.8);
  color: #fff;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}
.wishlist-btn.active {
  background: rgba(231, 76, 60, 0.8);
}

.meta {
  color: #ccc;
  font-size: 15px;
}
.rating {
  color: #f39c12;
  font-weight: 600;
}
.description {
  margin-top: 16px;
  line-height: 1.7;
  color: #e0e0e0;
}
</style>
