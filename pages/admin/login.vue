<template>
  <div class="min-h-screen flex items-center justify-center bg-secondary">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-dark mb-6 text-center">Admin Login</h2>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-dark mb-1">Username</label>
          <input 
            v-model="username" 
            type="text"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-dark mb-1">Password</label>
          <div class="relative">
            <input 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary pr-10"
            >
            <button 
              type="button"
              @click="togglePassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="!text-red-500 text-sm">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

const togglePassword = () => {
  showPassword.value = !showPassword.value
  // For debugging: Uncomment to log the current state
  // console.log('Password visibility:', showPassword.value)
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const response = await $fetch('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })
    
    if (response.success) {
      router.push('/admin')
    }
  } catch (err) {
    error.value = err.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>