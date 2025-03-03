<template>
  <div class="min-h-screen flex items-center justify-center bg-secondary">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold text-dark mb-6 text-center">Admin Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-dark mb-1">Username</label>
          <input v-model="username" type="text" required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
        </div>

        <div class="relative">
          <label class="block text-sm font-medium text-dark mb-1">Password</label>
          <div class="flex">
            <input ref="passwordInput" v-model="password" :type="showPassword ? 'text' : 'password'"
              autocomplete="current-password" required
              class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary" />
            <button type="button" class="absolute right-2 top-[29px] p-1" @click="togglePassword" tabindex="-1"
              v-if="password.length > 0">
              <i class="bi" :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="text-sm mt-2 error-message">
          {{ error }}
        </div>

        <button type="submit" class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
          :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const passwordInput = ref(null)
const authState = useAuthState()

const togglePassword = () => {
  showPassword.value = !showPassword.value
  setTimeout(() => {
    passwordInput.value.focus()
    const length = password.value.length
    passwordInput.value.setSelectionRange(length, length)
  }, 0)
}

watch(password, (newVal) => {
  // Keep track of password changes for toggle button visibility
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await $fetch('/api/admin/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    })

    if (response.success) {
      const session = useCookie('admin-session')
      // Verify cookie exists before navigation
      if (session.value) {
        await navigateTo('/admin', {
          replace: true,
          force: true
        })
      }
    }
  } catch (err) {
    error.value = err.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style>
.error-message {
  color: #ef4444 !important;
}

[class*='theme-'] .error-message,
:root .error-message {
  color: #ef4444 !important;
}
</style>
