<template>
  <div :class="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script setup>
const config = useRuntimeConfig()
const { theme, setTheme } = useTheme()
setTheme(config.public.storeTheme)
</script>
