<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const config = useRuntimeConfig()
const { theme, setTheme } = useTheme()
setTheme(config.public.storeTheme)
</script>
