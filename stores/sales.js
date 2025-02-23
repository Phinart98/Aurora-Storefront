import { defineStore } from 'pinia'
import { useDatabase } from 'vuefire'
import { ref as dbRef, push, onValue } from 'firebase/database'

export const useSalesStore = defineStore('sales', {
  state: () => ({
    sales: [],
    loading: false
  }),

  getters: {
    dailySales: (state) => {
      return groupSalesByDate(state.sales)
    },
    totalRevenue: (state) => {
      return state.sales.reduce((total, sale) => total + sale.total, 0)
    }
  },

  actions: {
    fetchSales() {
      const config = useRuntimeConfig()
      const db = useDatabase()
      const salesRef = dbRef(db, `${config.public.storePrefix}/sales`)

      onValue(salesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          this.sales = Object.entries(data).map(([id, sale]) => ({
            id,
            ...sale
          }))
        } else {
          this.sales = []
        }
      })
    },

    async logSale(saleData) {
      const config = useRuntimeConfig()
      const db = useDatabase()
      const salesRef = dbRef(db, `${config.public.storePrefix}/sales`)
      
      await push(salesRef, {
        ...saleData,
        timestamp: Date.now()
      })
    }
  }
})

function groupSalesByDate(sales) {
  return sales.reduce((groups, sale) => {
    const date = new Date(sale.timestamp).toLocaleDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(sale)
    return groups
  }, {})
}
