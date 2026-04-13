<template>
  <transition name="fade">
    <div v-if="cart.isOpen" class="overlay" @click="cart.closeCart"></div>
  </transition>

  <transition name="slide">
    <!-- Cuando el carrito esta abierto (con transicion) -->
    <div v-if="cart.isOpen" class="drawer">
      <!-- Si el carrito no contiene items y no hay items confirmados -->
      <div v-if="!cart.items.length && !confirmed" class="empty">
        <v-icon icon="mdi-cart-off" size="44" color="grey" />
        <p>Carrito vacío</p>
        <button class="btn-ghost" @click="cart.closeCart">Explorar juegos</button>
      </div>

      <!-- Si el carrido esta confirmado. Arroja texto y boton para ir a Mis juegos-->
      <div v-else-if="confirmed" class="confirmed">
        <v-icon icon="mdi-check-circle-outline" size="52" color="green-lighten-2" />
        <p class="confirmed-title">¡Compra realizada con éxito!</p>
        <p class="confirmed-sub">Disfruta tus juegos en "Mis juegos".</p>
        <button class="btn-primary" @click="goToMyGames">Ver mis juegos →</button>
        <button class="btn-ghost" @click="((confirmed = false), cart.closeCart())">
          Seguir comprando
        </button>
      </div>

      <!-- Items en el carrito -->
      <template v-else>
        <div class="drawer-body">
          <transition-group name="item-anim" tag="div">
            <!-- Hacer miniaturas por cada item en cart (desde global store) -->
            <div v-for="item in cart.items" :key="item.id" class="cart-item">
              <img :src="item.background_image" :alt="item.name" class="item-img" />
              <div class="item-info">
                <p class="item-name">{{ item.name }}</p>
                <p class="item-price">${{ item.price.toFixed(2) }}</p>
                <div class="qty-row">
                  <!-- Botones para aumentar o disminuir cantidad -->
                  <button class="qty-btn" @click="cart.changeQuantity(item.id, -1)">−</button>
                  <span>{{ item.quantity }}</span>
                  <button class="qty-btn" @click="cart.changeQuantity(item.id, +1)">+</button>
                </div>
              </div>
              <button class="remove-btn" @click="cart.removeFromCart(item.id)">
                <v-icon icon="mdi-close" size="14" />
              </button>
            </div>
          </transition-group>
        </div>
        <!-- Footer del carrito -->
        <div class="drawer-footer">
          <div class="total-row">
            <span>Total</span>
            <strong>${{ cart.totalPrice.toFixed(2) }}</strong>
          </div>
          <button class="btn-primary" @click="confirm">Confirmar pedido</button>
          <button class="btn-ghost" @click="cart.clearCart">Vaciar carrito</button>
        </div>
      </template>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore() //Llamado a estado del store
const router = useRouter()
const confirmed = ref(false)

function confirm() {
  cart.confirmPurchase() // mueve items a Mis juegos
  confirmed.value = true
}

function goToMyGames() {
  confirmed.value = false
  cart.closeCart()
  router.push('MyGames') // push a ruta de Mis juegos
}
</script>

<style scoped>
/* para hacer el fondo mas oscuro cuando se abre el carrito */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(51, 51, 51, 0.45);
  z-index: 200;
}
/* transicion */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  max-width: 95vw;
  background: #271a2e;
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  z-index: 201;
  display: flex;
  flex-direction: column;
  color: #f0f0f0;
}
/* transicion */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 17px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}
.drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 500;
}

.drawer-body {
  margin-top: 60px;
  flex: 1;
  overflow-y: auto;
  padding: 15px 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
}

.cart-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.item-img {
  width: 72px;
  height: 52px;
  object-fit: cover;
  border-radius: 6px;
}
.item-info {
  flex: 1;
}
.item-name {
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 3px;
}
.item-price {
  font-size: 13px;
  color: #a78bfa;
  margin: 0 0 6px;
}
.qty-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.qty-btn {
  width: 22px;
  height: 22px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.qty-btn:hover {
  background: rgba(75, 32, 146, 0.342);
}
.remove-btn {
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 2px;
}
.remove-btn:hover {
  color: #e74c3c;
}

.item-anim-enter-active,
.item-anim-leave-active {
  transition: all 0.2s ease;
}
.item-anim-enter-from,
.item-anim-leave-to {
  opacity: 0;
  transform: translateX(16px);
}

.drawer-footer {
  padding: 16px 17px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  margin-bottom: 4px;
}
.total-row strong {
  color: #a78bfa;
}

.btn-primary {
  width: 100%;
  padding: 11px;
  background: #7c3aed;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover {
  background: #6d28d9;
}
.btn-ghost {
  background: none;
  border: none;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  text-align: center;
  padding: 4px;
}
.btn-ghost:hover {
  color: #999;
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #666;
  font-size: 14px;
}

.confirmed {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 2rem;
}
.confirmed-title {
  font-size: 1.2rem;
  font-weight: 500;
  margin: 0;
}
.confirmed-sub {
  font-size: 13px;
  color: #888;
  margin: 0 0 8px;
}
</style>
