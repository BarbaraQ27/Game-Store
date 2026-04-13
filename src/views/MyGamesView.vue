<template>
  <v-main>
    <div class="page">
      <div class="page-header">
        <h1 class="page-title">
          <v-icon icon="mdi-controller-classic" size="24" class="mr-2" />
          Mis juegos
        </h1>
        <!-- Cuenta de juegos. Se agrega la s de plurar si hay mas de 1 juego, sino se deja singular -->
        <span class="game-count"
          >{{ cart.myGames.length }} juego{{ cart.myGames.length !== 1 ? 's' : '' }}</span
        >
      </div>

      <!-- Sin juegos -->
      <div v-if="!cart.myGames.length" class="empty">
        <v-icon icon="mdi-gamepad-variant-outline" size="56" color="grey-lighten-1" />
        <p class="empty-title">Aún no tienes juegos</p>
        <p class="empty-sub">Explora la tienda y confirma tu primera compra.</p>
        <v-btn
          :to="{ name: 'Store' }"
          color="deep-purple-lighten-2"
          variant="tonal"
          prepend-icon="mdi-store"
        >
          Ir a la tienda
        </v-btn>
      </div>

      <!-- Grilla de juegos -->
      <transition-group v-else name="game-in" tag="div" class="games-grid">
        <!-- por cada juego que se recibe en carrito confirmado -->
        <div v-for="game in cart.myGames" :key="game.id" class="game-card">
          <router-link :to="`/game/${game.id}`" class="card-link">
            <div class="card-img-wrap">
              <img :src="game.background_image" :alt="game.name" class="card-img" />
              <!-- simular el play de juego -->
              <div class="card-overlay">
                <v-icon icon="mdi-play-circle" size="36" color="white" />
              </div>
            </div>
          </router-link>
          <!-- Tarjeta para la lista -->
          <div class="card-body">
            <p class="card-name">{{ game.name }}</p>
            <div class="card-meta">
              <!-- para incluir dia de compra -->
              <span class="card-date">
                <v-icon icon="mdi-calendar-check" size="12" class="mr-1" />
                {{ game.purchasedAt }}
              </span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </v-main>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore'
const cart = useCartStore() //uso desde el store Cart
</script>

<style scoped>
.page {
  padding: 18px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-title {
  font-size: 25px;
  font-weight: 500;
  display: flex;
  align-items: center;
  text-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 50px #fff,
    0 0 10px #0ff,
    0 0 20px #0ff,
    0 0 30px #0ff;
}
.game-count {
  font-size: 13px;
  color: #888;
  background: rgba(124, 58, 237, 0.12);
  color: #a78bfa;
  padding: 4px 12px;
  border-radius: 99px;
  font-weight: 500;
}

/* cuando esta vacio */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 36px;
  text-align: center;
}
.empty-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
}
.empty-sub {
  font-size: 14px;
  color: #888;
  margin: 0 0 8px;
}

/* Grid */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 25px;
}

/* Card */
.game-card {
  border-radius: 10px;
  overflow: hidden;
  color: #261f3a;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.07);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.card-link {
  display: block;
  text-decoration: none;
}
.card-img-wrap {
  position: relative;
}
.card-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.game-card:hover .card-img {
  transform: scale(1.05);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.game-card:hover .card-overlay {
  opacity: 1;
}

.card-body {
  padding: 10px 12px 12px;
}
.card-name {
  font-size: 15px;
  font-weight: 500;
  margin: 0 0 6px;
}

.card-date {
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  color: #261f3a;
}

/* transicion */
.game-in-enter-active {
  transition: all 0.3s ease;
}
.game-in-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
