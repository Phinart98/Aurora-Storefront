<template>
  <div class="px-4 md:px-0">
    <h1 class="text-xl md:text-2xl font-bold text-primary-dark mb-6">Our Menu</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <ProductCard 
        v-for="product in availableProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>


<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '~/stores/products'
import ProductCard from '~/components/ProductCard.vue'

const productStore = useProductStore()
const { list: products } = storeToRefs(productStore)

const availableProducts = computed(() => {
  return products.value.filter(product => product.isAvailable)
})

onMounted(() => {
  productStore.fetchProducts()
})
</script>
