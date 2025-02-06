<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-3 md:p-4 z-50">
    <div class="bg-secondary rounded-lg shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-secondary-dark">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['close'])

const handleEscape = (e) => {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>
