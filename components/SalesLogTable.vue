<template>
    <div>
      <!-- Search Bar -->
      <div class="mb-4 flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Search by product name, date..."
            class="w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>
        <select 
          v-model="paymentFilter"
          class="p-2 border rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="">All Payments</option>
          <option value="cash">Cash</option>
          <option value="momo">Mobile Money</option>
          <option value="card">Card</option>
        </select>
      </div>
  
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold">Sales History</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-secondary-dark">
              <tr>
                <th class="p-4 text-left">Date</th>
                <th class="p-4 text-left">Items</th>
                <th class="p-4 text-left">Payment</th>
                <th class="p-4 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in filteredSales" :key="sale.id" class="border-t">
                <td class="p-4">{{ new Date(sale.timestamp).toLocaleString() }}</td>
                <td class="p-4">
                  <div v-for="item in sale.items" :key="item.id" class="text-sm">
                    {{ item.name }} x {{ item.quantity }}
                  </div>
                </td>
                <td class="p-4 capitalize">{{ sale.paymentMethod }}</td>
                <td class="p-4">GH₵{{ sale.total.toFixed(2) }}</td>
              </tr>
              <tr v-if="filteredSales.length === 0">
                <td colspan="4" class="p-4 text-center text-accent">No sales found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const props = defineProps({
    sales: {
      type: Array,
      required: true
    }
  })
  
  const searchQuery = ref('')
  const paymentFilter = ref('')
  
  const filteredSales = computed(() => {
    return props.sales.filter(sale => {
      const matchesSearch = searchQuery.value === '' || 
        sale.items.some(item => item.name.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
        new Date(sale.timestamp).toLocaleDateString().includes(searchQuery.value)
      
      const matchesPayment = paymentFilter.value === '' || 
        sale.paymentMethod === paymentFilter.value
  
      return matchesSearch && matchesPayment
    }).sort((a, b) => b.timestamp - a.timestamp)
  })
  </script>
  