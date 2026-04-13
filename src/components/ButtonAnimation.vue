<script setup>
//Para pasar tipo de texto y reutilizar como btnText
defineProps({
  btnText: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <v-btn class="animated" size="x-large">{{ btnText }}</v-btn>
</template>

<style scoped>
/* Animacion boton */
@keyframes rotate {
  100% {
    transform: rotate(-1turn);
  }
}
.animated {
  position: relative;
  width: 340px;
  height: 8vh;
  text-decoration: none;
  color: rgb(179, 158, 187);
  flex-shrink: 0;
  margin: 5vw;
  overflow: unset;
  background: linear-gradient(#271941, #2d4181);
  border-radius: 50px 0 50px 0;
  &::before,
  &::after {
    content: '';
    position: absolute;
    left: -6px;
    top: -6px;
    width: calc(100% + 12px);
    height: calc(100% + 12px);
    background: #441c5f;
    --p: 50px; /* control the shape (can be percentage) */
    aspect-ratio: 3/2;
    clip-path: polygon(var(--p) 0, 100% 0, calc(100% - var(--p)) 100%, 0 100%);
    background-image: linear-gradient(
      45deg,
      #ff8a25,
      #4fff88,
      #56ffef,
      #37b4ff,
      #c05aff,
      #ff8a25,
      #4fff88,
      #56ffef,
      #37b4ff,
      #c05aff
    );
    background-size: 500%;
    animation: position 40s linear infinite alternate;
    z-index: -1;
  }

  &::after {
    filter: blur(10px);
  }
}

@keyframes position {
  0% {
    background-position: 0 0;
  }
  50% {
    background-position: 400% 0;
  }
  100% {
    background-position: 0 0;
  }
}
</style>
