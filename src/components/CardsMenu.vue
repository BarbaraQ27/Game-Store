<template>
  <v-card class="card" :to="`/game/${game.id}`">
    <v-img height="200" :src="game.background_image" :alt="game.name" cover>
      <template #error>
        <div class="img-fallback">Sin imagen</div>
      </template>
      <!-- Metacritic sobre la imagen -->
      <div v-if="game.metacritic" class="metacritic" :class="metacriticColor">
        {{ game.metacritic }}
      </div>
    </v-img>

    <v-card-title class="card-title">{{ game.name }}</v-card-title>

    <v-card-subtitle class="card-sub">
      <v-rating
        :model-value="game.rating"
        color="amber"
        density="compact"
        size="small"
        half-increments
        readonly
      />
      <span class="rating-text">{{ game.rating?.toFixed(1) }} / 5</span>
    </v-card-subtitle>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  game: { type: Object, required: true },
})

//Cambiar el color de la calificacion
const metacriticColor = computed(() => {
  const s = props.game.metacritic
  if (s >= 80) return 'score-green'
  if (s >= 60) return 'score-yellow'
  return 'score-red'
})
</script>

<style scoped>
.card {
  width: 280px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  background-color: #5c7c8f59;
  color: rgb(127, 197, 255);
  text-decoration: none;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.card-title {
  font-size: 16px;
  white-space: nowrap;
}
.card-sub {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 4px;
}
.rating-text {
  font-size: 12px;
  color: rgb(161, 127, 255);
}

/* Badge metacritic sobre imagen */
.metacritic {
  position: absolute;
  top: 8px;
  right: 8px;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
}
.score-green {
  background: #27ae60;
  color: #fff;
}
.score-yellow {
  background: #f39c12;
  color: #fff;
}
.score-red {
  background: #e74c3c;
  color: #fff;
}

.img-fallback {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2a2a2a;
  color: #666;
  font-size: 13px;
}
</style>
