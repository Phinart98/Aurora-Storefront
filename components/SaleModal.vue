<template>
  <BaseModal @close="$emit('close')">
    <div class="p-4 md:p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg md:text-xl font-bold text-primary-dark">Log New Sale</h2>
        <button @click="$emit('close')" class="text-accent hover:text-primary">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-accent mb-1">Date</label>
          <input 
            v-model="formData.date" 
            type="datetime-local"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-accent mb-1">Products</label>
          <div class="space-y-2">
            <div v-for="(item, index) in formData.items" :key="index" class="flex gap-2">
              <select 
                v-model="item.productId"
                @change="updateItemPrice(index)"
                class="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">Select Product</option>
                <option 
                  v-for="product in availableProducts" 
                  :key="product.id" 
                  :value="product.id"
                >
                  {{ product.name }} - GH₵{{ product.price }}
                </option>
              </select>
              <input 
                v-model.number="item.quantity"
                type="number"
                min="1"
                placeholder="Qty"
                class="w-20 p-2 border rounded-lg focus:ring-2 focus:ring-primary"
              >
              <button 
                type="button"
                @click="removeItem(index)"
                class="text-red-500 hover:text-red-600"
              >
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
          <button 
            type="button"
            @click="addItem"
            class="mt-2 text-primary hover:text-primary-dark flex items-center gap-1"
          >
            <i class="bi bi-plus-circle"></i>
            Add Product
          </button>
        </div>

        <div>
          <label class="block text-sm font-medium text-accent mb-1">Payment Method</label>
          <select 
            v-model="formData.paymentMethod"
            required
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="">Select Payment Method</option>
            <option value="cash">Cash</option>
            <option value="momo">Mobile Money</option>
            <option value="card">Card</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-accent mb-1">Customer Details (Optional)</label>
          <textarea 
            v-model="formData.customerDetails"
            rows="2"
            placeholder="Name, Contact, etc."
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary resize-none"
          ></textarea>
        </div>

        <div class="pt-4 border-t">
          <div class="flex justify-between text-lg font-bold">
            <span>Total:</span>
            <span class="text-primary">GH₵{{ calculateTotal().toFixed(2) }}</span>
          </div>
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
            class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Log Sale' }}
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '~/stores/products'

const props = defineProps({
  sale: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['close', 'submit'])
const loading = ref(false)
const productStore = useProductStore()

const availableProducts = computed(() => {
  return productStore.list.filter(p => p.isAvailable)
})

const formData = ref({
  date: new Date().toISOString().slice(0, 16),
  items: [{ productId: '', quantity: 1 }],
  paymentMethod: '',
  customerDetails: '',
})

const addItem = () => {
  formData.value.items.push({ productId: '', quantity: 1 })
}

const removeItem = (index) => {
  formData.value.items.splice(index, 1)
}

const updateItemPrice = (index) => {
  const item = formData.value.items[index]
  const product = availableProducts.value.find(p => p.id === item.productId)
  if (product) {
    item.price = product.price
  }
}

const calculateTotal = () => {
  return formData.value.items.reduce((total, item) => {
    const product = availableProducts.value.find(p => p.id === item.productId)
    return total + (product?.price || 0) * item.quantity
  }, 0)
}

const handleSubmit = async () => {
  try {
    loading.value = true
    
    const saleData = {
      ...formData.value,
      timestamp: new Date(formData.value.date).getTime(),
      total: calculateTotal(),
      items: formData.value.items.map(item => {
        const product = availableProducts.value.find(p => p.id === item.productId)
        return {
          id: item.productId,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        }
      })
    }
    
    await emit('submit', saleData)
    emit('close')
  } catch (error) {
    console.error('Error logging sale:', error)
  } finally {
    loading.value = false
  }
}
</script>
