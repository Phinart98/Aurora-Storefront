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

  const totalRevenue = Object.values(productSales).reduce((sum, { revenue }) => sum + revenue, 0)
  const topProducts = Object.entries(productSales)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5)
    .map(([name, data]) => ({
      name,
      percentage: (data.revenue / totalRevenue) * 100
    }))

  return {
    labels: topProducts.map(product => product.name),
    datasets: [{
      label: 'Revenue Share',
      backgroundColor: [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#96CEB4',
        '#FFEEAD'
      ],
      data: topProducts.map(product => product.percentage)
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
        label: (context) => `${context.raw.toFixed(1)}% of total revenue`
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value}%`
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
