<template>
  <div class="chart-container">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  const dates = []
  const revenues = []
  const totalRevenue = props.sales.reduce((sum, sale) => sum + sale.total, 0)
  
  const dailyRevenue = props.sales.reduce((acc, sale) => {
    const date = new Date(sale.timestamp).toLocaleDateString()
    acc[date] = (acc[date] || 0) + sale.total
    return acc
  }, {})

  Object.entries(dailyRevenue)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .forEach(([date, revenue]) => {
      dates.push(date)
      revenues.push((revenue / totalRevenue) * 100)
    })

  return {
    labels: dates,
    datasets: [{
      label: 'Revenue %',
      backgroundColor: 'rgba(116, 185, 255, 0.2)',
      borderColor: '#4A90E2',
      pointBackgroundColor: '#FF6B6B',
      pointBorderColor: '#4A90E2',
      data: revenues,
      fill: true,
      tension: 0.4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
    y: {
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
