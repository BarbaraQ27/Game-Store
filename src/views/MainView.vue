<script setup>
import ButtonAnimation from '@/components/ButtonAnimation.vue'
const icons = ['mdi-github', 'mdi-linkedin']
</script>

<template>
  <div class="fullscreen-header">
    <div class="container text-center">
      <div class="row">
        <div class="col-sm">GAME</div>
        <div class="col-sm"></div>
        <div class="col-sm">STORE</div>
      </div>
    </div>
    <div class="container-fluid">
      <div class="col-8 col-md-8">
        <p
          v-motion
          :initial="{
            opacity: 0,
            y: 100,
          }"
          :delay="500"
          :enter="{
            opacity: 1,
            y: 0,
          }"
        >
          ¡Tus juegos favoritos en un solo lugar! Esta APP simula una tienda de compra de
          videojuegos, donde podrás buscar tus juegos, añadirlos a lista de deseados y comprar
          mediante un carrito para incluirlos en tu lista.
        </p>
      </div>

      <div
        class="button"
        v-motion
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :delay="2000"
        :enter="{
          opacity: 1,
          y: 0,
        }"
      >
        <ButtonAnimation btnText="Entrar a la tienda" to="/login" />
      </div>
    </div>
  </div>
  <v-footer class="text-center d-flex flex-column">
    <div class="d-flex ga-2">
      <v-btn
        v-for="icon in icons"
        :key="icon"
        :icon="icon"
        density="comfortable"
        variant="text"
      ></v-btn>
    </div>

    <v-divider class="my-1" thickness="2" width="70"></v-divider>

    <div>{{ new Date().getFullYear() }} — <strong>Barbara Quiroz</strong></div>
  </v-footer>
</template>

<style scoped>
.fullscreen-header {
  height: 100vh; /* Takes 100% of the viewport height */
  width: 100vw; /* Takes 100% of the viewport width */
  display: flex;
  flex-direction: column;
  background: url('/character.jpg') center/cover no-repeat;
}
.container {
  position: relative;
  max-width: 100vw;
  font-size: 10vw;
  margin: 3vw 0 5vw 1vw;
  align-items: center;
  color: #fff;
  text-shadow:
    0 0 5px #fff,
    0 0 10px #fff,
    0 0 20px #fff,
    0 0 40px #0ff,
    0 0 80px #0ff,
    0 0 90px #0ff,
    0 0 100px #0ff,
    0 0 150px #0ff;
}
.container-fluid {
  position: absolute;
}
.col-8 {
  margin: 50vh 0 0 3vw;
  color: aliceblue;
}
p {
  font-size: 2vw;
}
.button {
  opacity: 0.8;
  margin-top: -2vw;
}

@media (max-width: 600px) {
  p {
    font-size: 12px; /* Minimum fallback for small screens */
  }
}
.v-footer {
  background: none;
  margin-top: -9vh;
}
</style>
