<template>
  <div class="min-h-screen p-6">
    <div class="bg-secondary-dark rounded-lg p-4">
      <h1 class="text-3xl font-bold mb-6">Your Cart</h1>
      <div v-if="cartItems.length === 0" class="text-xl text-gray-600">
        Your cart is empty.
      </div>
      <div v-else>
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="w-full md:max-w-lg bg-white rounded-lg shadow-lg border border-gray-200 p-4 mb-4 mx-auto transition-transform hover:scale-105 flex flex-col md:flex-row items-center justify-between"
        >
          <div class="flex-1">
            <h2 class="text-lg font-semibold break-words">{{ item.name }}</h2>
            <p class="text-gray-600">Quantity: {{ item.quantity }}</p>
          </div>
          <div class="flex items-center gap-4 mt-4 md:mt-0">
            <span class="text-lg font-bold text-primary">
              GH₵{{ (item.price * item.quantity).toFixed(2) }}
            </span>
            <button @click="removeFromCart(item)" class="flex items-center gap-1 text-red-500 hover:text-red-600">
              <i class="bi bi-trash"></i>
              <span>Remove</span>
            </button>
          </div>
        </div>
        <div class="mt-6 text-right">
          <p class="text-xl font-bold">Total: GH₵{{ cartTotal.toFixed(2) }}</p>
          <button @click="checkout" class="mt-4 bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
            Checkout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const { items: cartItems, total: cartTotal } = storeToRefs(cartStore)

const removeFromCart = (item) => {
  cartStore.removeItem(item)
}

const checkout = () => {
  if (cartItems.value.length === 0) return
  
  let message = "Hello, I would like to place an order:\n"
  cartItems.value.forEach((item) => {
    message += `${item.name} - Quantity: ${item.quantity}, Subtotal: GH₵${(item.price * item.quantity).toFixed(2)}\n`
  })
  message += `Total: GH₵${cartTotal.value.toFixed(2)}`
  
  window.location.href = `https://wa.me/233546784566?text=${encodeURIComponent(message)}`
}
</script>
