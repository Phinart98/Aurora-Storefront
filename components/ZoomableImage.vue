<template>
  <div class="relative group cursor-zoom-in">
    <img 
      :src="src" 
      :alt="alt" 
      class="w-full h-36 md:h-48 object-cover rounded-md transition-transform duration-300"
      @click="openModal"
    >
    
    <!-- Overlay for hover effect; pointer-events are disabled so clicks pass to the image -->
    <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 flex items-center justify-center">
      <i class="bi bi-zoom-in text-xl md:text-2xl text-white"></i>
    </div>

    <BaseModal v-if="showFullImage" @close="closeModal">
      <div class="relative">
        <!-- Visible Close Button -->
        <button @click="closeModal" class="absolute top-2 right-2 z-10 text-white bg-black/50 rounded-full p-2 focus:outline-none">
          <i class="bi bi-x-lg"></i>
        </button>
        <!-- Panzoom container -->
        <div ref="panzoomContainer" class="p-3 md:p-4 overflow-hidden" style="touch-action: none;">
          <img :src="src" :alt="alt" class="block mx-auto max-h-[80vh] object-contain rounded-lg" />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, nextTick, onBeforeUnmount } from 'vue'
import BaseModal from './BaseModal.vue'
import Panzoom from '@panzoom/panzoom'

defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  }
})

const showFullImage = ref(false)
const panzoomContainer = ref(null)
let panzoomInstance = null

const openModal = () => {
  showFullImage.value = true
  // Wait until the modal is rendered
  nextTick(() => {
    if (panzoomContainer.value) {
      panzoomInstance = Panzoom(panzoomContainer.value, {
        maxScale: 5,
        contain: 'invert'
      })
    }
  })
}

const closeModal = () => {
  showFullImage.value = false
  if (panzoomInstance) {
    panzoomInstance.destroy()
    panzoomInstance = null
  }
}

onBeforeUnmount(() => {
  if (panzoomInstance) panzoomInstance.destroy()
})
</script>
