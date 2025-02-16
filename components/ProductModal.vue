<template>
  <BaseModal @close="$emit('close')">
    <div class="p-4 md:p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg md:text-xl font-bold text-primary-dark">
          {{ isEdit ? 'Edit Product' : 'Add New Product' }}
        </h2>
        <button @click="$emit('close')" class="text-accent hover:text-primary">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-accent mb-1">Name</label>
          <input 
            v-model="formData.name" 
            type="text" 
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>

        <!-- <div>
          <label class="block text-sm font-medium text-accent mb-1">Category</label>
          <select 
            v-model="formData.category"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>
        </div> -->

        <!-- <div>
          <label class="block text-sm font-medium text-accent mb-1">SKU</label>
          <input 
            v-model="formData.sku" 
            type="text" 
            placeholder="Optional - Will be auto-generated if empty"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div> -->

        <div>
          <label class="block text-sm font-medium text-accent mb-1">Description</label>
          <textarea 
            v-model="formData.description" 
            rows="3"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-accent mb-1">Price (GH₵)</label>
          <input 
            v-model.number="formData.price" 
            type="number" 
            step="0.01"
            min="0"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-accent mb-1">Image</label>
          <input 
            type="file" 
            @change="handleImageChange" 
            accept="image/*"
            :required="!isEdit"
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary text-sm"
          >
          <div v-if="isEdit && formData.image" class="mt-2">
            <img :src="formData.image" alt="Current image" class="h-20 w-20 object-cover rounded">
          </div>
        </div>

        <div class="flex items-center gap-2">
          <label class="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              v-model="formData.isAvailable"
              class="sr-only peer"
            >
            <div class="w-11 h-6 bg-accent-light peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
          <span class="text-sm font-medium text-accent">Available for Order</span>
        </div>

        <div v-if="error" class="text-primary text-sm">
          {{ error }}
        </div>

        <div class="flex justify-end gap-2 pt-4">
          <button 
            type="button" 
            @click="$emit('close')"
            class="px-4 py-2 text-accent hover:text-primary"
          >
            Cancel
          </button>
          <button 
            type="submit"
            class="px-4 py-2 bg-primary text-secondary rounded-lg hover:bg-primary-dark transition-colors duration-300"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : (isEdit ? 'Update' : 'Add') }}
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import { useProductStore } from '~/stores/products'
import BaseModal from './BaseModal.vue'

const productStore = useProductStore()
const categories = computed(() => productStore.categories)

const props = defineProps({
  product: {
    type: Object,
    default: () => ({
      name: '',
      description: '',
      price: 0,
      category: '',
      sku: '',
      isAvailable: true,
      image: ''
    })
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'submit'])
const formData = ref({ ...props.product })
const imageFile = ref(null)
const loading = ref(false)
const error = ref('')

const handleImageChange = (event) => {
  imageFile.value = event.target.files[0]
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    if (!imageFile.value && !props.isEdit) {
      error.value = 'Please select an image'
      return
    }

    await emit('submit', {
      formData: formData.value,
      imageFile: imageFile.value
    })
    emit('close')
  } catch (err) {
    error.value = err.message || 'An error occurred'
  } finally {
    loading.value = false
  }
}
</script>
