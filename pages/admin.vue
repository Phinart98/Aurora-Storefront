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
          Add New Product
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
      <div v-for="product in products" :key="product.id" 
           class="bg-secondary-dark p-4 rounded-lg shadow-card">
        <div class="relative">
          <img :src="product.image" :alt="product.name" class="w-full h-36 md:h-48 object-cover rounded mb-4">
          <span 
            :class="[
              'absolute top-2 right-2 px-2 py-1 rounded text-xs md:text-sm text-white',
              product.isAvailable ? 'bg-green-500' : 'bg-red-500'
            ]"
          >
            {{ product.isAvailable ? 'Available' : 'Not Available' }}
          </span>
        </div>
        <h3 class="font-semibold text-primary-dark text-base md:text-lg">{{ product.name }}</h3>
        <p class="text-accent-light text-sm mt-1 line-clamp-2">{{ product.description }}</p>
        <p class="font-bold text-primary-dark mt-2 text-base md:text-lg">GH₵{{ product.price.toFixed(2) }}</p>
        <div class="flex gap-2 mt-4">
          <button 
            @click="editProduct(product)" 
            class="flex-1 bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center gap-1 text-sm md:text-base"
          >
            <i class="bi bi-pencil"></i>
            Edit
          </button>
          <button 
            @click="removeProduct(product.id)" 
            class="flex-1 bg-red-500/10 text-red-500 px-3 py-2 rounded hover:bg-red-500/20 transition-colors duration-300 flex items-center justify-center gap-1 text-sm md:text-base"
          >
            <i class="bi bi-trash"></i>
            Delete
          </button>
        </div>
      </div>
    </div>

    <ProductModal 
      v-if="showModal" 
      :product="selectedProduct"
      :is-edit="!!selectedProduct"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '~/stores/products'

const username = ref('')
const password = ref('')
const error = ref('')
const isLoggedIn = ref(false)
const showModal = ref(false)
const selectedProduct = ref(null)
const productStore = useProductStore()
const { list: products } = storeToRefs(productStore)

onMounted(() => {
  isLoggedIn.value = localStorage.getItem('isAdmin') === 'true'
  if (isLoggedIn.value) {
    productStore.fetchProducts()
  }
})

const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    localStorage.setItem('isAdmin', 'true')
    isLoggedIn.value = true
    error.value = ''
    productStore.fetchProducts()
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
  selectedProduct.value = null
}

const editProduct = (product) => {
  selectedProduct.value = product
  showModal.value = true
}

const handleSubmit = async ({ formData, imageFile }) => {
  try {
    if (selectedProduct.value) {
      await productStore.updateProduct(selectedProduct.value.id, formData, imageFile)
    } else {
      await productStore.addProduct(formData, imageFile)
    }
    closeModal()
  } catch (error) {
    throw new Error(error.message)
  }
}

const removeProduct = async (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await productStore.deleteProduct(productId)
  }
}
</script>
