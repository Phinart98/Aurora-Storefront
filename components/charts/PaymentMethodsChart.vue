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
  const paymentMethods = props.sales.reduce((acc, sale) => {
    acc[sale.paymentMethod] = (acc[sale.paymentMethod] || 0) + sale.total
    return acc
  }, {})

  return {
    labels: Object.keys(paymentMethods).map(method => method.toUpperCase()),
    datasets: [{
      data: Object.values(paymentMethods),
      backgroundColor: [
        '#DC2626',
        '#991B1B',
        '#1F2937',
        '#FEE2E2'
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
      position: 'bottom',
      labels: {
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      callbacks: {
        label: (context) => `GH₵${context.raw.toFixed(2)}`
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
