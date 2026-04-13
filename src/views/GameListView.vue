<template>
  <div class="container text-center">
    <div class="row row-cols-auto">
      <v-main>
        <!-- Texto desde la store, devuelve la promesa si se cumple o arroja error -->
        <div v-if="store.loading" class="status">Cargando juegos...</div>
        <div v-else-if="store.error" class="status error">{{ store.error }}</div>

        <!-- Si recibe el fetch, arroja las tarjetas. Cada tarjeta lleva a la ruta de su juego mediante la propiedad slug (nombre simplificado) -->
        <div v-else class="row row-cols-auto" name="gameCards">
          <GameCard
            v-for="game in store.games"
            :key="game.id"
            :game="game"
            :to="`/game/${game.slug}`"
            class="cards"
          />
        </div>
        <!-- Compaginar las tarjetas (atras y adelante) -->
        <div class="pagination">
          <button class="pageBtn" @click="store.changePage(-1)" :disabled="store.page === 1">
            ← Anterior
          </button>
          <span>Página {{ store.page }}</span>
          <button class="pageBtn" @click="store.changePage(1)" :disabled="store.loading">
            Siguiente →
          </button>
        </div>
      </v-main>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameCard from '@/components/GameCard.vue'

//Solo es necesario llamar a la store ya que el fetch es global desde ahi
const store = useGameStore()
onMounted(() => store.fetchGames())
</script>

<style scoped>
.v-main {
  margin-left: 5vw;
}
.status {
  text-align: center;
  padding: 32px;
  color: #888;
}
.status.error {
  color: #c0392b;
}
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.cards {
  text-decoration: none;
  color: beige;
}
.pageBtn {
  margin-bottom: 16px;
  padding: 7px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  cursor: pointer;
  color: #fff;
  backdrop-filter: blur(4px);
}
.pageBtn:hover {
  background: rgba(27, 123, 179, 0.25);
}
</style>
