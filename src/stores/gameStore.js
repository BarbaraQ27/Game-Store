import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

//Link base de la API
const BASE_URL = 'https://api.rawg.io/api'

//Importacion de la API key desde archivo .env y confeccion de la URL de la API en base a parametros (EJ. api.rawg.io/api/{path=games}?API KEY/)&{query=released}
function buildUrl(path, params = {}) {
  const query = new URLSearchParams({
    key: import.meta.env.VITE_RAWG_API_KEY,
    ...params,
  })
  return `${BASE_URL}/${path}?${query}`
}
//Base de la estructura de pinia defineStore
export const useGameStore = defineStore(
  'game', //define que game llevara la funcion global
  () => {
    const games = ref([]) //array para fech de juegos
    const featuredGames = ref([]) //array para fetch de juegos top
    const currentGame = ref(null) //para obtener datos de detalle del juego actual (null por defecto)
    const wishlist = ref([]) //array para contener los objetos de wishlist

    const loading = ref(false) //considerar la asincronia del fetch y pasarlo a un estado(falso por defecto)
    const loadingDetail = ref(false) //carga de detalle de un juego (falso por defecto)
    const error = ref(null) //asincronia del fetch para pasarlo al estado error (null por defecto)

    const page = ref(1) //pagina que se carga (por defecto empieza en la primera)
    const query = ref('') //consulta a la API (vacio por defecto)
    const pageSize = ref(12) //numero de objetos que se muestran en una pagina (12 por defecto)

    // Imagen de fondo activa — null = fondo por defecto del dashboard
    const backgroundImage = ref(null)

    // ─── Acciones: juegos ───
    //fetch principal para obtener la data de la API. Utiliza el buildUrl como direccion para axios, entiende el path games
    //loading true para mostrar en pantalla como carga y termina con false cuando la promesa se cumpla
    //error null por defecto, cambia si catch recibe el error
    async function fetchGames() {
      loading.value = true
      error.value = null
      try {
        const params = { page: page.value, page_size: pageSize.value }
        if (query.value) params.search = query.value
        const res = await axios.get(buildUrl('games', params))
        games.value = res.data.results
      } catch {
        error.value = 'No se pudieron cargar los juegos. Intenta de nuevo.'
        games.value = []
      } finally {
        loading.value = false
      }
    }
    //fetch para obtener datos de juegos con parametros de metacritics (mejores evaluados) y ordanados por fecha de lanzamiento
    async function fetchFeatured() {
      if (featuredGames.value.length > 0) return
      try {
        const res = await axios.get(
          buildUrl('games', { metacritic: '95,100', ordering: '-released', page_size: 8 }),
        )
        featuredGames.value = res.data.results
      } catch { /* no muestra el error */ }
    }

    //fetch del detalle de un juego en particular (mediante id)
    //loading true para mostrar en pantalla como carga el detalle y termina con false cuando la promesa se cumpla
    //error null por defecto, cambia si catch recibe el error
    //currentGame null por defecto, cambia cuando se llama a la data del juego actual
    async function fetchGameDetail(id) {
      loadingDetail.value = true
      error.value = null
      currentGame.value = null
      backgroundImage.value = null // reset mientras carga
      try {
        const res = await axios.get(buildUrl(`games/${id}`)) //fetch del juego por ID
        currentGame.value = res.data
        // activa el fondo con la imagen del juego
        backgroundImage.value = res.data.background_image ?? null
      } catch {
        error.value = 'No se pudo cargar el detalle del juego.'
      } finally {
        loadingDetail.value = false
      }
    }

    // limpia el fondo al salir del detalle
    function clearBackground() {
      backgroundImage.value = null
    }
    // funcion de busqueda por termino, este termino pasa a ser valor del query en la URL y devuelve los resultados en una pagina
    // debe llamar al fetch principal para obtener la data
    function search(term) {
      query.value = term
      page.value = 1
      fetchGames()
    }
    // cambio de pagina (direccion 1 para siguiente y -1 para anterior)
    // retorna la nueva pagina
    // llama a fetch principal para mostrar la data por pagina
    function changePage(dir) {
      if (page.value === 1 && dir === -1) return
      page.value += dir
      fetchGames()
    }

    // ─── Acciones: wishlist ───
    //agregar a deseados por juego
    //si al menos 1 elemento se encuentra en wishlist (array), envia los valores de la data expresados
    function addToWishlist(game) {
      if (wishlist.value.some((g) => g.id === game.id)) return
      wishlist.value.push({
        id: game.id,
        name: game.name,
        background_image: game.background_image,
        released: game.released,
        rating: game.rating,
        metacritic: game.metacritic,
      })
    }
    //elimiar de la wishlist por id (del array creado)
    //filtra el array wishlist verificando por id
    function removeFromWishlist(id) {
      wishlist.value = wishlist.value.filter((g) => g.id !== id)
    }
    //toggle del estado. Si esta en wishlist se puede llamar a la funcion eliminar de wishlist o añadir a wishlist
    function toggleWishlist(game) {
      isInWishlist(game.id) ? removeFromWishlist(game.id) : addToWishlist(game)
    }
    //verifica si esta en wishlist y devuelve su resultado si al menos un elemento se encuenta
    //
    function isInWishlist(id) {
      return wishlist.value.some((g) => g.id === id)
    }
    //la funcion global retornara las constantes y funciones. Esto lo hace reutilizable para todos los componentes
    return {
      games, featuredGames, currentGame, wishlist,
      loading, loadingDetail, error,
      page, query,
      backgroundImage,
      fetchGames, fetchFeatured, fetchGameDetail, clearBackground,
      search, changePage,
      addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist,
    }
  },
  //del plugin persist para guardar los estados de estas rutas
  { persist: { paths: ['wishlist'] } },
  { persist: { paths: ['mygames'] } },

)
