<template>
  <div class="chart-container">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

// Override Chart.js defaults
ChartJS.defaults.color = '#4B5563'
ChartJS.defaults.borderColor = '#E5E7EB'

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  const productSales = props.sales.reduce((acc, sale) => {
    sale.items.forEach(item => {
      if (!acc[item.name]) {
        acc[item.name] = {
          quantity: 0,
          revenue: 0
        }
      }
      acc[item.name].quantity += item.quantity
      acc[item.name].revenue += item.price * item.quantity
    })
    return acc
  }, {})

  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)

  return {
    labels: topProducts.map(([name]) => name),
    datasets: [{
      label: 'Revenue',
      backgroundColor: [
        '#DC2626',
        '#991B1B',
        '#1F2937',
        '#4B5563',
        '#FEE2E2'
      ],
      data: topProducts.map(([, data]) => data.revenue)
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context) => `GH₵${context.raw.toFixed(2)}`
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `GH₵${value}`
      }
    }
  }
}
</script>

<style scoped>
.chart-container {
  height: 250px;
  @media (min-width: 768px) {
    height: 300px;
  }
}
</style>
