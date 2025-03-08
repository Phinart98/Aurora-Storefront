<template>
  <div class="chart-container">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  sales: {
    type: Array,
    required: true
  }
})

const chartData = computed(() => {
  const paymentMethods = props.sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total
    return acc
  }, {})

  const total = Object.values(paymentMethods).reduce((sum, value) => sum + value, 0)
  const percentages = Object.entries(paymentMethods).map(([method, value]) => ({
    method: method.toUpperCase(),
    value: value,
    percentage: (value / total) * 100
  }))

  return {
    labels: percentages.map(p => p.method),
    datasets: [{
      data: percentages.map(p => p.percentage),
      rawData: percentages.map(p => p.value),
      backgroundColor: [
        '#FF9F1C',
        '#2EC4B6',
        '#E71D36',
        '#011627'
      ],
      borderColor: 'transparent'
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: window.innerWidth < 768 ? 'bottom' : 'right',
      labels: {
        padding: window.innerWidth < 768 ? 10 : 20,
        usePointStyle: true,
        pointStyle: 'circle',
        font: {
          size: window.innerWidth < 768 ? 10 : 11
        }
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.dataset.rawData[context.dataIndex]
          return `GH₵${value.toFixed(2)} (${context.raw.toFixed(1)}%)`
        }
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
