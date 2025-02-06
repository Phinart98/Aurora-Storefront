<template>
  <div v-if="!isLoggedIn">
    <div class="min-h-[80vh] flex items-center justify-center px-4 md:px-0">
      <div class="bg-secondary p-6 md:p-8 rounded-lg shadow-card w-full max-w-md">
        <h1 class="text-xl md:text-2xl font-bold text-primary-dark mb-6">Admin Login</h1>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-accent mb-1">Username</label>
            <input 
              v-model="username" 
              type="text" 
              required
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-accent mb-1">Password</label>
            <input 
              v-model="password" 
              type="password" 
              required
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
            >
          </div>

          <div v-if="error" class="text-primary text-sm">
            {{ error }}
          </div>

          <button 
            type="submit"
            class="w-full bg-primary text-secondary py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  </div>

  <div v-else class="bg-secondary p-4 md:p-6 rounded-lg">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <h1 class="text-xl md:text-2xl font-bold text-primary-dark">Admin Panel</h1>
      <div class="flex gap-4 w-full md:w-auto">
        <button 
          @click="showModal = true" 
          class="flex-1 md:flex-none bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <i class="bi bi-plus-circle"></i>
          Add New Cuisine
        </button>
        <button 
          @click="logout" 
          class="flex-1 md:flex-none bg-accent-light text-secondary px-4 py-2 rounded-lg hover:bg-accent transition-colors duration-300"
        >
          Logout
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="cuisine in cuisines" :key="cuisine.id" 
           class="bg-secondary-dark p-4 rounded-lg shadow-card">
        <div class="relative">
          <img :src="cuisine.image" :alt="cuisine.name" class="w-full h-36 md:h-48 object-cover rounded mb-4">
          <span 
            :class="[
              'absolute top-2 right-2 px-2 py-1 rounded text-xs md:text-sm text-secondary',
              cuisine.isAvailable ? 'bg-green-500' : 'bg-primary'
            ]"
          >
            {{ cuisine.isAvailable ? 'Available' : 'Not Available' }}
          </span>
        </div>
        <h3 class="font-semibold text-primary-dark text-base md:text-lg">{{ cuisine.name }}</h3>
        <p class="text-accent-light text-sm mt-1 line-clamp-2">{{ cuisine.description }}</p>
        <p class="font-bold text-primary-dark mt-2 text-base md:text-lg">GH₵{{ cuisine.price.toFixed(2) }}</p>
        <div class="flex gap-2 mt-4">
          <button 
            @click="editCuisine(cuisine)" 
            class="flex-1 bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center gap-1 text-sm md:text-base"
          >
            <i class="bi bi-pencil"></i>
            Edit
          </button>
          <button 
            @click="removeCuisine(cuisine.id)" 
            class="flex-1 bg-red-500/10 text-red-500 px-3 py-2 rounded hover:bg-red-500/20 transition-colors duration-300 flex items-center justify-center gap-1 text-sm md:text-base"
          >
            <i class="bi bi-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>

    <CuisineModal 
      v-if="showModal" 
      :cuisine="selectedCuisine"
      :is-edit="!!selectedCuisine"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCuisineStore } from '~/stores/cuisines'

const username = ref('')
const password = ref('')
const error = ref('')
const isLoggedIn = ref(false)
const showModal = ref(false)
const selectedCuisine = ref(null)
const cuisineStore = useCuisineStore()
const { list: cuisines } = storeToRefs(cuisineStore)

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('isAdmin') === 'true'
  if (isLoggedIn.value) {
    cuisineStore.fetchCuisines()
  }
})

const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    localStorage.setItem('isAdmin', 'true')
    isLoggedIn.value = true
    error.value = ''
    cuisineStore.fetchCuisines()
  } else {
    error.value = 'Invalid credentials'
  }
}

const logout = () => {
  localStorage.removeItem('isAdmin')
  isLoggedIn.value = false
}

const closeModal = () => {
  showModal.value = false
  selectedCuisine.value = null
}

const editCuisine = (cuisine) => {
  selectedCuisine.value = cuisine
  showModal.value = true
}

const handleSubmit = async ({ formData, imageFile }) => {
  try {
    if (selectedCuisine.value) {
      await cuisineStore.updateCuisine(selectedCuisine.value.id, formData, imageFile)
    } else {
      await cuisineStore.addCuisine(formData, imageFile)
    }
    closeModal()
  } catch (error) {
    throw new Error(error.message)
  }
}

const removeCuisine = async (cuisineId) => {
  if (confirm('Are you sure you want to delete this cuisine?')) {
    await cuisineStore.deleteCuisine(cuisineId)
  }
}
</script>
