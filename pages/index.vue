<template>
  <div class="px-4 md:px-0">
    <h1 class="text-xl md:text-2xl font-bold text-primary-dark mb-6">Our Menu</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <CuisineCard 
        v-for="cuisine in availableCuisines" 
        :key="cuisine.id" 
        :cuisine="cuisine" 
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCuisineStore } from '~/stores/cuisines'
import CuisineCard from '~/components/CuisineCard.vue'

const cuisineStore = useCuisineStore()
const { list: products } = storeToRefs(cuisineStore)

const availableCuisines = computed(() => {
  return products.value.filter(product => product.isAvailable)
})

onMounted(() => {
  cuisineStore.fetchCuisines()
})
</script>
