<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-md w-full">
      <nav class="w-full px-6 md:px-8 lg:px-10 py-3">
        <div class="flex justify-between items-center">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="~/assets/logo.jpeg" alt="Shnell's Kitchen Logo" class="h-8 w-8" />
            <span class="text-xl font-bold text-primary-dark">Shnell's Kitchen</span>
          </NuxtLink>
          <div class="flex items-center gap-4">
            <NuxtLink to="/" class="flex items-center text-dark hover:text-primary">
              <i class="bi bi-book me-1"></i>
              <span>Menu</span>
            </NuxtLink>
            <NuxtLink to="/cart" class="flex items-center text-dark hover:text-primary relative">
              <i class="bi bi-cart me-1"></i>
              <span>Cart</span>
              <span
                v-if="cartStore.itemCount"
                class="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                {{ cartStore.itemCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <main class="w-full px-6 md:px-8 lg:px-10 py-6">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart'
const cartStore = useCartStore()
</script>
