<template>
  <div class="container-flex">
    <v-text-field
      v-model="searchTerm"
      :loading="loading"
      append-inner-icon="mdi-magnify"
      density="compact"
      label="Buscar juegos"
      variant="solo"
      hide-details
      single-line
      @click:append-inner="onClick"
      @keyup.enter="onClick"
    ></v-text-field>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const searchTerm = ref('')
const loading = ref(false)
const emit = defineEmits(['search'])
const router = useRouter()
//Al hacer click o presionar enter se despliega la busqueda en la pantalla Store
function onClick() {
  emit('search', searchTerm.value)
  router.push({ name: 'Store' })
}
</script>

<style scoped>
.container-flex {
  width: 40vw;
}
</style>
