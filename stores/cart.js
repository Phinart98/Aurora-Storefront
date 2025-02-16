import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: []
  }),

  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    total: (state) => state.items.reduce((total, item) => total + item.price * item.quantity, 0)
  },

  actions: {
    addItem(product) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },

    removeItem(product) {
      const index = this.items.findIndex(item => item.id === product.id)
      if (index !== -1) {
        this.items.splice(index, 1)
      }
    },

    clearCart() {
      this.items = []
    }
  }
})
