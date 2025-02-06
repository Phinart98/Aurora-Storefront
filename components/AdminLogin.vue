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
          <input 
            v-model="password" 
            type="password"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>

        <div v-if="error" class="text-red-500 text-sm">
          {{ error }}
        </div>

        <button 
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (username.value === 'admin' && password.value === 'admin') {
    emit('login', true)
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>
