<template>
  <div class="space-y-6">
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <h2 class="text-xl font-bold text-primary-dark">Sales Reports</h2>
      
      <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0">
        <button 
          v-for="period in periods"
          :key="period.value"
          @click="selectPeriod(period.value)"
          class="px-3 py-1.5 rounded-lg whitespace-nowrap"
          :class="selectedPeriod === period.value 
            ? 'bg-primary text-white' 
            : 'bg-white text-accent hover:bg-primary/10'"
        >
          {{ period.label }}
        </button>
        
        <button 
          @click="showCustomRange = true"
          class="px-3 py-1.5 rounded-lg whitespace-nowrap bg-white text-accent hover:bg-primary/10 flex items-center gap-1"
        >
          <i class="bi bi-calendar3"></i>
          Custom
        </button>
      </div>
    </div>

    <div v-if="showCustomRange" class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-accent mb-1">Start Date</label>
          <input 
            v-model="customRange.start"
            type="date"
            class="p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>
        <div>
          <label class="block text-sm font-medium text-accent mb-1">End Date</label>
          <input 
            v-model="customRange.end"
            type="date"
            class="p-2 border rounded-lg focus:ring-2 focus:ring-primary"
          >
        </div>
        <button 
          @click="applyCustomRange"
          class="mt-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Apply
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-sm text-accent-light mb-1">Total Revenue</h3>
        <p class="text-2xl font-bold text-primary">
          GH₵{{ filteredRevenue.toFixed(2) }}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-sm text-accent-light mb-1">Total Orders</h3>
        <p class="text-2xl font-bold text-primary">
          {{ filteredSales.length }}
        </p>
      </div>
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-sm text-accent-light mb-1">Average Order Value</h3>
        <p class="text-2xl font-bold text-primary">
          GH₵{{ (filteredRevenue / filteredSales.length || 0).toFixed(2) }}
        </p>
      </div>
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
              <td class="p-4">{{ formatDate(sale.timestamp) }}</td>
              <td class="p-4">
                <div v-for="item in sale.items" :key="item.id" class="text-sm">
                  {{ item.name }} x {{ item.quantity }}
                </div>
              </td>
              <td class="p-4 capitalize">{{ sale.paymentMethod }}</td>
              <td class="p-4">GH₵{{ sale.total.toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useSalesStore } from '~/stores/sales'

const salesStore = useSalesStore()
const selectedPeriod = ref('today')
const showCustomRange = ref(false)
const customRange = ref({
  start: '',
  end: ''
})

const periods = [
  { value: 'today', label: "Today's Sales" },
  { value: 'month', label: 'Past Month' },
  { value: 'quarter', label: 'Past 3 Months' },
  { value: 'year', label: 'Past Year' }
]

const getDateRange = (period) => {
  const now = new Date()
  const start = new Date()
  
  switch (period) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case 'month':
      start.setMonth(start.getMonth() - 1)
      break
    case 'quarter':
      start.setMonth(start.getMonth() - 3)
      break
    case 'year':
      start.setFullYear(start.getFullYear() - 1)
      break
    case 'custom':
      return {
        start: new Date(customRange.value.start),
        end: new Date(customRange.value.end)
      }
  }
  
  return { start, end: now }
}

const filteredSales = computed(() => {
  const { start, end } = getDateRange(selectedPeriod.value)
  return salesStore.sales.filter(sale => {
    const saleDate = new Date(sale.timestamp)
    return saleDate >= start && saleDate <= end
  }).sort((a, b) => b.timestamp - a.timestamp)
})

const filteredRevenue = computed(() => {
  return filteredSales.value.reduce((total, sale) => total + sale.total, 0)
})

const selectPeriod = (period) => {
  selectedPeriod.value = period
  showCustomRange.value = false
}

const applyCustomRange = () => {
  if (customRange.value.start && customRange.value.end) {
    selectedPeriod.value = 'custom'
    showCustomRange.value = false
  }
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}
</script>
