<template>
  <div v-if="isAuthenticated" class="h-[calc(100vh-60px)] flex flex-col md:flex-row">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-primary text-white">
      <h1 class="text-lg font-bold">Admin Dashboard</h1>
      <button @click="isMenuOpen = !isMenuOpen" class="text-2xl">
        <i class="bi" :class="isMenuOpen ? 'bi-x' : 'bi-list'"></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="md:w-64 bg-white shadow-md md:h-full">
      <div :class="['md:block', isMenuOpen ? 'block' : 'hidden']">
        <div class="p-4 space-y-2">
          <button 
            v-for="item in navItems" 
            :key="item.id"
            @click="selectTab(item.id)"
            :class="[
              'w-full text-left px-4 py-2 rounded-lg flex items-center gap-2',
              activeTab === item.id 
                ? 'bg-primary text-white' 
                : 'hover:bg-primary/10 text-accent'
            ]"
          >
            <i :class="['bi', item.icon]"></i>
            {{ item.label }}
          </button>
          
          <button 
            @click="logout"
            class="w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 text-accent hover:bg-accent/10"
          >
            <i class="bi bi-box-arrow-right"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Content Area -->
    <div class="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
      <!-- Products Tab -->
      <div v-if="activeTab === 'products'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-xl md:text-2xl font-bold text-primary-dark">Products</h1>
          <button 
            @click="showProductModal = true" 
            class="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            :disabled="isLoading"
          >
            <i class="bi bi-plus-circle"></i>
            <span class="hidden sm:inline">Add New Product</span>
          </button>
        </div>

        <!-- Loading indicator -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <div v-for="product in products" :key="product.id" 
               class="bg-secondary-dark p-4 rounded-lg shadow-card">
            <div class="relative">
              <img :src="product.image" :alt="product.name" class="w-full h-36 md:h-48 object-cover rounded mb-4">
              <span 
                :class="[
                  'absolute top-2 right-2 px-2 py-1 rounded text-xs md:text-sm text-white',
                  product.isAvailable ? 'bg-green-500' : 'bg-red-500'
                ]"
              >
                {{ product.isAvailable ? 'Available' : 'Not Available' }}
              </span>
            </div>
            <h3 class="font-semibold text-primary-dark text-base md:text-lg">{{ product.name }}</h3>
            <p class="text-accent-light text-sm mt-1 line-clamp-2">{{ product.description }}</p>
            <p class="font-bold text-primary-dark mt-2 text-base md:text-lg">GH₵{{ product.price.toFixed(2) }}</p>
            <div class="flex gap-2 mt-4">
              <button 
                @click="editProduct(product)" 
                class="flex-1 bg-primary/10 text-primary px-3 py-2 rounded hover:bg-primary/20 transition-colors duration-300 flex items-center justify-center gap-1"
              >
                <i class="bi bi-pencil"></i>
                <span>Edit</span>
              </button>
              <button 
                @click="removeProduct(product.id)" 
                class="flex-1 bg-red-500/10 text-red-500 px-3 py-2 rounded hover:bg-red-500/20 transition-colors duration-300 flex items-center justify-center gap-1"
              >
                <i class="bi bi-trash"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sales Tab -->
      <div v-else-if="activeTab === 'sales'" class="space-y-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-xl md:text-2xl font-bold text-primary-dark">Sales Log</h1>
          <button 
            @click="showSaleModal = true"
            class="bg-primary text-secondary px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <i class="bi bi-plus-circle"></i>
            <span>Log New Sale</span>
          </button>
        </div>
        <SalesLogTable :sales="salesStore.sales" />
      </div>

      <!-- Reports Tab -->
      <div v-else-if="activeTab === 'reports'" class="space-y-6">
        <h1 class="text-xl md:text-2xl font-bold text-primary-dark">Reports</h1>
        <SalesMetrics :sales="salesStore.sales" />
      </div>
    </div>

    <ProductModal 
      v-if="showProductModal" 
      :product="selectedProduct"
      :is-edit="!!selectedProduct"
      @close="closeProductModal"
      @submit="handleProductSubmit"
    />

    <SaleModal
      v-if="showSaleModal"
      @close="showSaleModal = false"
      @submit="handleSaleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '~/stores/products'
import { useSalesStore } from '~/stores/sales'
import SalesLogTable from '~/components/SalesLogTable.vue'
import SalesMetrics from '~/components/SalesMetrics.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const isMenuOpen = ref(false)
const showProductModal = ref(false)
const showSaleModal = ref(false)
const selectedProduct = ref(null)
const activeTab = ref('products')
const isLoading = ref(false)

const productStore = useProductStore()
const salesStore = useSalesStore()
const { list: products } = storeToRefs(productStore)

const navItems = [
  { id: 'products', label: 'Products', icon: 'bi-box' },
  { id: 'sales', label: 'Sales Log', icon: 'bi-receipt' },
  { id: 'reports', label: 'Reports', icon: 'bi-graph-up' }
]

onMounted(async () => {
  const session = useCookie('admin-session')
  if (!session.value) {
    router.push('/admin/login')
    return
  }
  isAuthenticated.value = true
  productStore.fetchProducts()
  salesStore.fetchSales()
})

const logout = async () => {
  await $fetch('/api/admin/logout', { method: 'POST' })
  const session = useCookie('admin-session')
  session.value = null
  isAuthenticated.value = false
  router.push('/admin/login')
}

const selectTab = (tab) => {
  activeTab.value = tab
  isMenuOpen.value = false
}

const closeProductModal = () => {
  showProductModal.value = false
  selectedProduct.value = null
}

const editProduct = (product) => {
  selectedProduct.value = product
  showProductModal.value = true
}

const handleProductSubmit = async ({ formData, imageFile }) => {
  try {
    isLoading.value = true
    if (selectedProduct.value) {
      await productStore.updateProduct(selectedProduct.value.id, formData, imageFile)
    } else {
      await productStore.addProduct(formData, imageFile)
    }
    closeProductModal()
  } catch (error) {
    throw new Error(error.message)
  } finally {
    isLoading.value = false
  }
}

const handleSaleSubmit = async (saleData) => {
  try {
    isLoading.value = true
    await salesStore.logSale(saleData)
    showSaleModal.value = false
  } catch (error) {
    throw new Error(error.message)
  } finally {
    isLoading.value = false
  }
}

const removeProduct = async (productId) => {
  if (confirm('Are you sure you want to delete this product?')) {
    await productStore.deleteProduct(productId)
  }
}
</script>
