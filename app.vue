<template>
  <div :class="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useTheme } from '~/composables/useTheme'
const { theme, setTheme } = useTheme()
// Change this line to switch themes
setTheme('default') // Use: 'default', 'fashion', 'electronics', 'luxury', 'dark', or 'nature'
</script>
