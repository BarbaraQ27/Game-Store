<template>
  <div class="home">
    <h2 class="title">Top Metacritics</h2>
    <CarrouselMenu />

    <h3 class="subtitle">Top reviews</h3>

    <!-- Texto desde la store, devuelve la promesa si se cumple o arroja error -->
    <div v-if="store.loading" class="status">Cargando juegos...</div>
    <div v-else-if="store.error" class="status error">{{ store.error }}</div>
    <!-- Cumple el fetch de datos y arroja las tarjetas -->
    <div v-else class="cards-row">
      <CardsMenu v-for="game in topGames" :key="game.id" :game="game" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import CarrouselMenu from '@/components/CarrouselMenu.vue'
import CardsMenu from '@/components/CardsMenu.vue'

const store = useGameStore()

// Muestra los 3 juegos recientes del listado (solo pagina 1)
const topGames = computed(() =>
  [...store.games]
    .filter((g) => g.released)
    .sort((a, b) => new Date(b.released) - new Date(a.released))
    .slice(0, 3),
)
</script>

<style scoped>
.home {
  padding: 20px;
}
.title {
  font-size: 25px;
  font-weight: 500;
  margin-bottom: 16px;
}
.subtitle {
  font-size: 18px;
  font-weight: 500;
  margin: 16px 0 16px;
}
.cards-row {
  display: flex;
  flex-wrap: wrap;
  gap: 45px;
}
.status {
  padding: 32px;
  text-align: center;
  color: #888;
}
.status.error {
  color: #e74c3c;
}
</style>
