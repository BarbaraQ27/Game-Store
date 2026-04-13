<template>
  <v-carousel
    v-if="store.featuredGames.length"
    height="55vh"
    show-arrows="hover"
    cycle
    hide-delimiter-background
  >
    <v-carousel-item v-for="game in store.featuredGames" :key="game.id">
      <div class="d-flex justify-center align-center">
        <img :src="game.background_image" :alt="game.name" />
      </div>
      <div class="caption">
        <h1>{{ game.name }}</h1>
      </div>
    </v-carousel-item>
  </v-carousel>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const store = useGameStore()
onMounted(() => store.fetchFeatured())
</script>

<style scoped>
.v-carousel {
  margin: 2vh 0;
}
.d-flex img {
  object-fit: cover;
  height: 55vh;
  width: 100%;
}
.caption {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.7);
}
</style>
