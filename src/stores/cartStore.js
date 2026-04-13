import { defineStore } from 'pinia'
import { ref, computed } from 'vue'


//formato globlar de pinia para estructurar la estore
export const useCartStore = defineStore(
  'cart', //cart llevara la funcion global
  () => {
    const items = ref([]) //array de items (vacio por defecto)
    const myGames = ref([]) // array de juegos confirmados (vacio por defecto)
    const isOpen = ref(false) //estado del carrito (si esta abierto o no, falso por defecto)

    //computa la suma total de los items en array
    const totalItems = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
    //computa el calculo de la suma de precio x cantidad del array items
    const totalPrice = computed(() =>
      items.value.reduce((acc, i) => acc + i.price * i.quantity, 0),
    )

    //añadir al carrito por juego
    function addToCart(game) {
      const existing = items.value.find((i) => i.id === game.id) //busca si existe un item (definido por el id del juego)
      if (existing) {
        existing.quantity++ //si existe este item, se suma
      } else {
        items.value.push({ //si no existe en el carrito, se crea un nuevo item con estos valores
          id: game.id,
          name: game.name,
          background_image: game.background_image,
          price: simulatedPrice(game.id), //precio simulado
          quantity: 1, //cantidad predeterminada
        })
      }
      isOpen.value = true //al añadirse un item al carrito, isOpen devuelve true (esta abierto)
    }

    //eliminar del carrito por id en el array items
    function removeFromCart(id) {
      items.value = items.value.filter((i) => i.id !== id)
    }

    //actualiza la cantidad de un elemento especifico (id), delta es la cantidad en la que se debe cambiar
    function changeQuantity(id, delta) {
      const item = items.value.find((i) => i.id === id)
      if (!item) return //si no existen items retorna la cantidad del item
      item.quantity += delta
      if (item.quantity <= 0) removeFromCart(id) //si la cantidad de items es menor o igual a 0, lo elimina del carrito
    }

    // Mueve los items del carrito a myGames (sin duplicar)
    function confirmPurchase() {
      items.value.forEach((cartItem) => { //por cada item del carrito
        const already = myGames.value.some((g) => g.id === cartItem.id) //al menos un elemento del carrito ya se encuentra en myGames
        if (!already) { //si no existe elemento, traspasa a myGames la sgte data
          myGames.value.push({
            id: cartItem.id,
            name: cartItem.name,
            background_image: cartItem.background_image,
            price: cartItem.price,
            purchasedAt: new Date().toLocaleDateString('es-CL'), //muestra la fecha en la que se realizo la compra (español, region Chile)
          })
        }
      })
      items.value = []
    }

    //elimina todos los elementos del carrito
    //devuelve el array a vacio
    function clearCart() { items.value = [] }

    //si al menos un item esta en el carro devuelve el item por id
    function isInCart(id) { return items.value.some((i) => i.id === id) }
    //si almenos un juego esta en myGames devuelve el juego por id
    function isOwned(id) { return myGames.value.some((g) => g.id === id) }

    //funcion para abrir el carrito
    function openCart() { isOpen.value = true }
    //funcion para cerrar el carrito
    function closeCart() { isOpen.value = false }

    //simula precios por id
    function simulatedPrice(id) {
      return [9.99, 19.99, 29.99, 59.99][id % 4] //residuo
    }

    return {
      items, myGames, isOpen,
      totalItems, totalPrice,
      addToCart, removeFromCart, changeQuantity,
      confirmPurchase, clearCart,
      isInCart, isOwned,
      openCart, closeCart,
    }
  },
  { persist: { paths: ['items', 'myGames'] } },
)
