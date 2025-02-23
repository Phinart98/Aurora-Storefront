<template>
  <div class="space-y-6">
    <!-- Period Selection -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4">
        <button 
          v-for="period in periods"
          :key="period.value"
          @click="selectPeriod(period.value)"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            selectedPeriod === period.value
              ? 'bg-primary text-white'
              : 'bg-secondary-dark hover:bg-primary/10'
          ]"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
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

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Revenue Trend</h3>
        <RevenueChart :sales="filteredSales" />
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold mb-4">Top Products</h3>
        <TopProductsChart :sales="filteredSales" />
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
        <h3 class="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
        <PaymentMethodsChart :sales="filteredSales" />
      </div>
    </div>

    <!-- Custom Date Range Modal -->
    <BaseModal v-if="showDatePicker" @close="showDatePicker = false">
      <div class="p-4">
        <h3 class="text-lg font-bold mb-4">Select Date Range</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1">Start Date</label>
            <input 
              v-model="dateRange.start"
              type="date"
              class="w-full p-2 border rounded-lg"
            >
          </div>
          <div>
            <label class="block text-sm mb-1">End Date</label>
            <input 
              v-model="dateRange.end"
              type="date"
              class="w-full p-2 border rounded-lg"
            >
          </div>
          <div class="flex justify-end gap-2">
            <button 
              @click="showDatePicker = false"
              class="px-4 py-2 text-accent"
            >
              Cancel
            </button>
            <button 
              @click="applyDateRange"
              class="px-4 py-2 bg-primary text-white rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RevenueChart from './charts/RevenueChart.vue'
import TopProductsChart from './charts/TopProductsChart.vue'
import PaymentMethodsChart from './charts/PaymentMethodsChart.vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

const selectedPeriod = ref('today')
const showDatePicker = ref(false)
const dateRange = ref({
  start: '',
  end: ''
})

const periods = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' }
]

const selectPeriod = (period) => {
  selectedPeriod.value = period
  if (period === 'custom') {
    showDatePicker.value = true
  }
}

const applyDateRange = () => {
  if (dateRange.value.start && dateRange.value.end) {
    showDatePicker.value = false
  }
}

const getDateRange = () => {
  const now = new Date()
  const start = new Date()
  
  switch (selectedPeriod.value) {
    case 'today':
      start.setHours(0, 0, 0, 0)
      break
    case 'week':
      start.setDate(start.getDate() - 7)
      break
    case 'month':
      start.setMonth(start.getMonth() - 1)
      break
    case 'year':
      start.setFullYear(start.getFullYear() - 1)
      break
    case 'custom':
      return {
        start: new Date(dateRange.value.start),
        end: new Date(dateRange.value.end)
      }
  }
  
  return { start, end: now }
}

const filteredSales = computed(() => {
  const { start, end } = getDateRange()
  return props.sales.filter(sale => {
    const saleDate = new Date(sale.timestamp)
    return saleDate >= start && saleDate <= end
  })
})

const filteredRevenue = computed(() => {
  return filteredSales.value.reduce((total, sale) => total + sale.total, 0)
})
</script>
