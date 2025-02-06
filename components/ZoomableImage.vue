<template>
  <div class="relative group cursor-zoom-in">
    <img 
      :src="src" 
      :alt="alt" 
      class="w-full h-36 md:h-48 object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
      @click="showFullImage = true"
    >
    
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <i class="bi bi-zoom-in text-xl md:text-2xl text-white"></i>
    </div>

    <BaseModal v-if="showFullImage" @close="showFullImage = false">
      <div class="p-3 md:p-4">
        <img 
          :src="src" 
          :alt="alt" 
          class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        >
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'

defineProps({
  src: { type: String, required: true },
  alt: { type: String, default: '' }
})

const showFullImage = ref(false)
</script>
