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
  
  const dailyRevenue = props.sales.reduce((acc, sale) => {
    const date = new Date(sale.timestamp).toLocaleDateString()
    acc[date] = (acc[date] || 0) + sale.total
    return acc
  }, {})

  Object.entries(dailyRevenue)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .forEach(([date, revenue]) => {
      dates.push(date)
      revenues.push(revenue)
    })

  return {
    labels: dates,
    datasets: [{
      label: 'Daily Revenue',
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
        label: (context) => `GH₵${context.raw.toFixed(2)}`
      }
    }
  },
  scales: {
    y: {
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
