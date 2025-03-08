<template>
  <div class="space-y-6 max-w-full">
    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <h2 class="text-xl font-bold text-primary-dark">Reports</h2>

      <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0 max-w-full">
        <button v-for="period in periods" :key="period.value" @click="selectPeriod(period.value)"
          class="px-3 py-1.5 rounded-lg whitespace-nowrap" :class="selectedPeriod === period.value
            ? 'bg-primary text-white'
            : 'bg-white text-accent hover:bg-primary/10'">
          {{ period.label }}
        </button>

        <button @click="showCustomRange = true"
          class="px-3 py-1.5 rounded-lg whitespace-nowrap bg-white text-accent hover:bg-primary/10 flex items-center gap-1">
          <i class="bi bi-calendar3"></i>
          Custom
        </button>
      </div>
    </div>

    <div class="text-sm text-accent-light">{{ currentDateRange.display }}</div>

    <div v-if="showCustomRange" class="bg-white p-4 rounded-lg shadow-sm">
      <div class="flex flex-wrap gap-4">
        <div>
          <label class="block text-sm font-medium text-accent mb-1">Start Date</label>
          <input v-model="customRange.start" type="date" class="p-2 border rounded-lg focus:ring-2 focus:ring-primary">
        </div>
        <div>
          <label class="block text-sm font-medium text-accent mb-1">End Date</label>
          <input v-model="customRange.end" type="date" class="p-2 border rounded-lg focus:ring-2 focus:ring-primary">
        </div>
        <button @click="applyCustomRange"
          class="mt-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
          Apply
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white p-4 rounded-lg shadow-sm">
        <h3 class="text-sm text-accent-light mb-1">Total Revenue</h3>
        <p class="text-2xl font-bold text-primary">
          GH₵{{ totalRevenue.toFixed(2) }}
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
          GH₵{{ averageOrderValue.toFixed(2) }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
      <div class="bg-white p-4 rounded-lg shadow-sm w-full overflow-hidden">
        <h3 class="text-lg font-semibold mb-4">Top Products</h3>
        <TopProductsChart :sales="filteredSales" />
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm w-full overflow-hidden">
        <h3 class="text-lg font-semibold mb-4">Payment Methods Distribution</h3>
        <PaymentMethodsChart :sales="filteredSales" />
      </div>

      <div class="bg-white p-4 rounded-lg shadow-sm lg:col-span-2 w-full overflow-hidden">
        <h3 class="text-lg font-semibold mb-4">Revenue Trend</h3>
        <RevenueChart :sales="filteredSales" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDateRange } from '~/composables/useDateRange'
import RevenueChart from './charts/RevenueChart.vue'
import TopProductsChart from './charts/TopProductsChart.vue'
import PaymentMethodsChart from './charts/PaymentMethodsChart.vue'

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

const selectedPeriod = ref('today')
const showCustomRange = ref(false)
const customRange = ref({
  start: '',
  end: ''
})

const periods = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' }
]

const { getDateRange } = useDateRange()

const currentDateRange = computed(() => getDateRange(selectedPeriod.value))

const filteredSales = computed(() => {
  return props.sales.filter(sale => {
    const saleDate = new Date(sale.timestamp)
    return saleDate >= currentDateRange.value.start && saleDate <= currentDateRange.value.end
  })
})

const totalRevenue = computed(() => {
  return filteredSales.value.reduce((total, sale) => total + sale.total, 0)
})

const averageOrderValue = computed(() => {
  return filteredSales.value.length ? totalRevenue.value / filteredSales.value.length : 0
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
</script>
