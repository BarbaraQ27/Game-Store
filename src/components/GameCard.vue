<template>
  <v-card :to="to" class="game-card" :ripple="true">
    <!-- Imagen de portada -->
    <v-img height="200" :src="game.background_image" :alt="game.name" cover>
      <template #error>
        <div class="img-fallback">Sin imagen</div>
      </template>
    </v-img>

    <!-- Titulo y metacritic -->
    <v-card-item>
      <v-card-title class="card-title">{{ game.name }}</v-card-title>
      <v-card-subtitle>
        <span v-if="game.metacritic" class="metacritic-badge" :class="metacriticColor">
          {{ game.metacritic }}
        </span>
        <span v-else class="no-score">Sin puntuación</span>
      </v-card-subtitle>
    </v-card-item>

    <!-- Rating y generos -->
    <v-card-text>
      <div class="rating-row">
        <v-rating
          :model-value="game.rating"
          color="amber"
          density="compact"
          size="small"
          half-increments
          readonly
        />
        <!-- Rating con 1 decimal -->
        <span class="rating-text">{{ game.rating?.toFixed(1) }} / 5</span>
      </div>
      <!-- Toma la totalidad de generos y los traspasa a chips -->
      <div v-if="genres.length" class="genres">
        <v-chip
          v-for="genre in genres"
          :key="genre.id"
          size="x-small"
          class="genre-chip"
          variant="tonal"
        >
          {{ genre.name }}
        </v-chip>
      </div>
      <!-- Arroja texto en caso que no exista fecha en API -->
      <p class="release-date">
        Fecha de lanzamiento:
        {{ game.released || 'Fecha desconocida' }}
      </p>

      <!-- Plataformas -->
      <div v-if="platforms.length" class="platforms">
        <!-- Por cada plataforma activa un tooltip con el nombre de esta -->
        <v-tooltip v-for="p in platforms" :key="p.slug" :text="p.name" location="top">
          <template #activator="{ props: tip }">
            <!-- Muestra los iconos desde la funcion que mapea estos datos -->
            <v-icon v-bind="tip" :icon="platformIcon(p.slug)" size="16" class="platform-icon" />
          </template>
        </v-tooltip>
      </div>
    </v-card-text>

    <v-divider />

    <!-- Acciones -->
    <v-card-actions class="actions">
      <!-- Wishlist. Alterna el icono (si esta activo o no) y el color de este. Llama a la funcion toggle desde la store global para agregar o quitar de la wishlist -->
      <v-btn
        :icon="inWishlist ? 'mdi-heart' : 'mdi-heart-outline'"
        :color="inWishlist ? 'red-lighten-1' : 'grey'"
        variant="text"
        size="small"
        @click.prevent="gameStore.toggleWishlist(game)"
        v-tooltip="inWishlist ? 'Quitar de wishlistAdd' : 'Agregar a wishlist'"
      />

      <!-- Comprar. Usa inCart para preguntar si esta en el carrito o se muestra el precio  -->
      <v-btn
        class="buy-btn"
        :class="{ 'in-cart': inCart }"
        variant="tonal"
        size="small"
        :prepend-icon="inCart ? 'mdi-check' : 'mdi-cart-plus'"
        @click.prevent="handleAddToCart"
      >
        {{ inCart ? 'En el carrito' : `Comprar · $${price}` }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
  game: { type: Object, required: true },
  to: { type: String, default: null },
})

// Uso de ambas stores globales
const gameStore = useGameStore()
const cartStore = useCartStore()

// Si esta en wishlist llamara a la funcion de la store game para pasar los datos del fetch
const inWishlist = computed(() => gameStore.isInWishlist(props.game.id))
//Si esta en carrito llamara a la funcion de la store cart para pasarle los datos del fetch
const inCart = computed(() => cartStore.isInCart(props.game.id))
//Computa los generos para mostrar hasta 3
const genres = computed(() => props.game.genres?.slice(0, 3) ?? [])

// La API RAWG devuelve: platforms: [{ platform: { id, name, slug } }, ...]
const platforms = computed(() => props.game.platforms?.map((p) => p.platform) ?? [])

const metacriticColor = computed(() => {
  const s = props.game.metacritic
  if (!s) return ''
  if (s >= 80) return 'score-green'
  if (s >= 60) return 'score-yellow'
  return 'score-red'
})

//Considera el precio con valores determinados
const price = computed(() => [9.99, 19.99, 29.99, 59.99][props.game.id % 4].toFixed(2))

// Mapea slugs de RAWG y los iconos de MDI (vuetify)
function platformIcon(slug) {
  const map = {
    pc: 'mdi-microsoft-windows',
    playstation4: 'mdi-sony-playstation',
    playstation5: 'mdi-sony-playstation',
    playstation3: 'mdi-sony-playstation',
    playstation2: 'mdi-sony-playstation',
    playstation1: 'mdi-sony-playstation',
    'xbox-one': 'mdi-microsoft-xbox',
    xbox360: 'mdi-microsoft-xbox',
    'xbox-series-x': 'mdi-microsoft-xbox',
    'nintendo-switch': 'mdi-nintendo-switch',
    ios: 'mdi-apple-ios',
    android: 'mdi-android',
    macos: 'mdi-apple',
    linux: 'mdi-linux',
    web: 'mdi-web',
    atari: 'mdi-atari',
    'sega-saturn': 'mdi-controller-classic',
    'nintendo-3ds': 'mdi-nintendo-game-boy',
    'nintendo-ds': 'mdi-nintendo-game-boy',
    'game-boy-advance': 'mdi-nintendo-game-boy',
    'wii-u': 'mdi-nintendo-switch',
    wii: 'mdi-nintendo-switch',
  }
  return map[slug] ?? 'mdi-controller-classic' //un default en caso de no encontrarse en la lista
}
//Si esta en el carrito llama a la funcion desde store global para mostrar los props almacenados de juego
function handleAddToCart() {
  if (!inCart.value)
    cartStore.addToCart(props.game) //si el valor no esta en carrito, funciona el add para mostrar datos al hacer click
  else cartStore.openCart() //de otra forma, solo abre el carrito
}
</script>

<style scoped>
.game-card {
  width: 280px;
  margin: 10px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  cursor: pointer;
}
.game-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 0 2px #fff,
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #0ff,
    0 0 40px #0ff,
    0 0 60px #0ff;
}
.v-img {
  box-shadow: 0 3px 6px 3px rgb(0, 0, 0);
}
.card-title {
  font-size: 20px;
}
.metacritic-badge {
  font-size: 15px;
  padding: 10px;
  border-radius: 20px;
}
/* Colores dependiendo de la nota en Metacritics */
.score-green {
  background: #27ae6022;
  color: #27ae60;
}
.score-yellow {
  background: #f39c1222;
  color: #f39c12;
}
.score-red {
  background: #e74c3c22;
  color: #e74c3c;
}
.no-score {
  font-size: 12px;
  color: #aaa;
}
/*  */
.rating-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}
.rating-text {
  font-size: 12px;
  color: #888;
}
.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}
.genre-chip {
  font-size: 11px;
}
.release-date {
  font-size: 12px;
  color: #999;
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
/* Plataformas */
.platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.platform-icon {
  color: #888;
  transition: color 0.15s;
}
.platform-icon:hover {
  color: #bbb;
}
.actions {
  padding: 8px 12px 12px;
  gap: 8px;
}
.buy-btn {
  margin-left: 50px;
  font-size: 12px;
  border-radius: 15px;
}

.buy-btn:hover {
  background-color: rgb(24, 71, 71);
}

.buy-btn.in-cart {
  color: #27ae60 !important;
}
</style>
