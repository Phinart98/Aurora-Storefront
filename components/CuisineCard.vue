<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6 hover:shadow-2xl transition-shadow duration-300">
    <ZoomableImage 
      :src="cuisine.image" 
      :alt="cuisine.name"
    />
    <h2 class="text-base md:text-lg font-semibold mb-2 mt-3 text-primary-dark line-clamp-1">{{ cuisine.name }}</h2>
    <p class="text-accent-light mb-3 md:mb-4 text-sm md:text-base line-clamp-2">{{ cuisine.description }}</p>
    <div class="flex justify-between items-center">
      <span class="text-sm md:text-base font-bold text-primary-dark">
        GH₵{{ cuisine.price.toFixed(2) }}
      </span>
      <button 
        @click="addToCart" 
        :disabled="!cuisine.isAvailable"
        class="bg-primary text-white px-2 md:px-3 py-1.5 md:py-2 rounded hover:bg-primary-dark transition-colors duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <i class="bi bi-cart-plus"></i>
        {{ cuisine.isAvailable ? 'Add to Cart' : 'Not Available' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
import ZoomableImage from './ZoomableImage.vue'

const props = defineProps({
  cuisine: {
    type: Object,
    required: true
  }
})

const cartStore = useCartStore()

const addToCart = () => {
  cartStore.addItem(props.cuisine)
}
</script>
