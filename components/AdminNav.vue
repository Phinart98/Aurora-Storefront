<template>
  <nav class="bg-secondary-dark md:w-64 md:min-h-screen">
    <!-- Mobile Header -->
    <div class="md:hidden flex items-center justify-between p-4 bg-primary text-white">
      <h1 class="text-lg font-bold">Admin Dashboard</h1>
      <button @click="isOpen = !isOpen" class="text-2xl">
        <i class="bi" :class="isOpen ? 'bi-x' : 'bi-list'"></i>
      </button>
    </div>

    <!-- Navigation Links -->
    <div :class="['md:block', isOpen ? 'block' : 'hidden']">
      <div class="p-4 space-y-2">
        <button 
          v-for="item in navItems" 
          :key="item.id"
          @click="selectView(item.id)"
          :class="[
            'w-full text-left px-4 py-2 rounded-lg flex items-center gap-2',
            currentView === item.id 
              ? 'bg-primary text-white' 
              : 'hover:bg-primary/10 text-accent'
          ]"
        >
          <i :class="['bi', item.icon]"></i>
          {{ item.label }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
const isOpen = ref(false)
const currentView = ref('products')

const navItems = [
  { id: 'products', label: 'Products', icon: 'bi-box' },
  { id: 'sales-log', label: 'Sales Log', icon: 'bi-journal-text' },
  { id: 'sales-report', label: 'Sales Report', icon: 'bi-graph-up' }
]

const emit = defineEmits(['view-change'])

const selectView = (view) => {
  currentView.value = view
  emit('view-change', view)
  isOpen.value = false
}
</script>
