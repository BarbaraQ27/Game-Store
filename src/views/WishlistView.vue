<template>
  <v-main>
    <div class="p-4">
      <h1 class="page-title">Wishlist</h1>

      <p v-if="!store.wishlist.length" class="empty">
        Tu lista está vacía. Agrega tus juegos deseados.
      </p>

      <transition-group name="fade-slide" tag="div" class="grid">
        <!-- Por cada juego desde la store wishlist se agregan tarjetas  -->
        <div v-for="game in store.wishlist" :key="game.id" class="game-card">
          <!-- Card simple -->
          <div class="card-content">
            <router-link :to="`/game/${game.id}`">
              <img :src="game.background_image" :alt="game.name" class="cover" />
            </router-link>
            <div class="card-footer">
              <span class="game-name">{{ game.name }}</span>
              <button class="remove-btn" @click="store.removeFromWishlist(game.id)">✕</button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </v-main>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
</script>

<style scoped>
.page-title {
  font-size: 25px;
  font-weight: 500;
  text-align: center;
  margin-bottom: 25px;
  text-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 50px #fff,
    0 0 10px #0ff,
    0 0 20px #0ff,
    0 0 30px #0ff;
}
.empty {
  text-align: center;
  color: #98b9df;
  margin-top: 42px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 2fr));
  gap: 16px;
}
.game-card {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.game-card:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
}

.card-content {
  position: relative;
  background: #91d2dd;
}
.cover {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  color: rgb(46, 25, 75);
}
.game-name {
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  max-width: 80%;
}
.remove-btn {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  font-size: 15px;
}
</style>
