<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6 hover:shadow-2xl transition-shadow duration-300">
    <ZoomableImage 
      :src="product.image" 
      :alt="product.name"
    />
    <h2 class="text-base md:text-lg font-semibold mb-2 mt-3 text-primary-dark line-clamp-1">{{ product.name }}</h2>
    <p class="text-accent-light mb-3 md:mb-4 text-sm md:text-base line-clamp-2">{{ product.description }}</p>
    <div class="space-y-3">
      <div class="flex justify-between items-center">
        <span class="text-sm md:text-base font-bold text-primary-dark">
          GH₵{{ (product.price * quantity).toFixed(2) }}
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="decrementQuantity"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-dark hover:bg-primary/10 text-accent"
            :disabled="quantity <= 1"
          >
            <i class="bi bi-dash"></i>
          </button>
          <span class="w-8 text-center">{{ quantity }}</span>
          <button 
            @click="incrementQuantity"
            class="w-8 h-8 flex items-center justify-center rounded-full bg-secondary-dark hover:bg-primary/10 text-accent"
          >
            <i class="bi bi-plus"></i>
          </button>
        </div>
      </div>
      <button 
        @click="addToCart" 
        :disabled="!product.isAvailable"
        class="w-full bg-primary text-white px-2 md:px-3 py-1.5 md:py-2 rounded hover:bg-primary/90 transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <i class="bi bi-cart-plus"></i>
        {{ product.isAvailable ? 'Add to Cart' : 'Not Available' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCartStore } from '~/stores/cart'
import ZoomableImage from './ZoomableImage.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()
const quantity = ref(1)

const incrementQuantity = () => {
  quantity.value++
}

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = () => {
  cartStore.addItem({ ...props.product, quantity: quantity.value })
  quantity.value = 1 // Reset quantity after adding to cart
  const { $successToast } = useNuxtApp()
  $successToast(`Added ${quantity.value} ${props.product.name} to cart`)
}
</script>
