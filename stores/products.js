import { defineStore } from 'pinia'
import { useDatabase } from 'vuefire'
import { ref as dbRef, push, onValue, remove, update, get } from 'firebase/database'

// Helper functions
function extractPublicId(url) {
  const parts = url.split('/upload/')
  if (parts.length < 2) return null
  const publicIdWithExtension = parts[1]
  const withoutVersion = publicIdWithExtension.replace(/^v\d+\//, '')
  const dotIndex = withoutVersion.lastIndexOf('.')
  if (dotIndex === -1) return withoutVersion
  return withoutVersion.substring(0, dotIndex)
}

async function deleteImageFromCloudinary(publicId) {
  try {
    const response = await fetch('/api/deleteImage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete image')
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete image from Cloudinary')
    }
  } catch (error) {
    console.error('Image deletion error:', error)
    throw error
  }
}

export const useProductStore = defineStore('products', {
  state: () => ({
    list: [],
    categories: []
  }),

  actions: {
    fetchProducts() {
      const config = useRuntimeConfig()
      const db = useDatabase()
      const productsRef = dbRef(db, `${config.public.storePrefix}/products`)

      onValue(productsRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          this.list = Object.entries(data).map(([id, product]) => ({
            id,
            ...product
          }))
        } else {
          this.list = []
        }
      })

      const categoriesRef = dbRef(db, `${config.public.storePrefix}/categories`)
      onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          this.categories = Object.values(data)
        } else {
          this.categories = []
        }
      })
    },

    async addCategory(categoryName) {
      const config = useRuntimeConfig()
      const db = useDatabase()
      const categoriesRef = dbRef(db, `${config.public.storePrefix}/categories`)
      await push(categoriesRef, categoryName)
    },

    async removeCategory(categoryId) {
      const config = useRuntimeConfig()
      const db = useDatabase()
      const categoryRef = dbRef(db, `${config.public.storePrefix}/categories/${categoryId}`)
      await remove(categoryRef)
    },

    async addProduct(product, imageFile) {
      try {
        const formData = new FormData()
        formData.append('file', imageFile)

        const config = useRuntimeConfig()
        formData.append('upload_preset', config.public.cloudinaryUploadPreset)
        const cloudName = config.public.cloudinaryCloudName

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData }
        )
        const uploadResult = await uploadResponse.json()
        if (!uploadResult.secure_url) {
          throw new Error('Image upload failed')
        }

        const db = useDatabase()
        const productsRef = dbRef(db, `${config.public.storePrefix}/products`)

        const productData = {
          name: product.name,
          description: product.description,
          price: Number(product.price),
          category: product.category || 'uncategorized',
          sku: product.sku || `SKU-${Date.now()}`,
          isAvailable: !!product.isAvailable,
          image: uploadResult.secure_url,
          createdAt: Date.now()
        }

        await push(productsRef, productData)
        const { $successToast } = useNuxtApp()
        $successToast('Product added successfully!')
        return { success: true }
      } catch (error) {
        const { $failToast } = useNuxtApp()
        $failToast('Failed to add product: ' + error.message)
        throw error
      }
    },

    async updateProduct(id, product, imageFile) {
      try {
        let imageUrl = product.image

        if (imageFile && imageFile.size > 0) {
          if (product.image) {
            const publicId = extractPublicId(product.image)
            if (publicId) {
              await deleteImageFromCloudinary(publicId)
            }
          }

          const formData = new FormData()
          formData.append('file', imageFile)

          const config = useRuntimeConfig()
          formData.append('upload_preset', config.public.cloudinaryUploadPreset)
          const cloudName = config.public.cloudinaryCloudName

          const uploadResponse = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: 'POST', body: formData }
          )
          const uploadResult = await uploadResponse.json()
          if (!uploadResult.secure_url) {
            throw new Error('Image upload failed')
          }
          imageUrl = uploadResult.secure_url
        }

        const config = useRuntimeConfig()
        const db = useDatabase()
        const productRef = dbRef(db, `${config.public.storePrefix}/products/${id}`)
        await update(productRef, {
          name: product.name,
          description: product.description,
          price: Number(product.price),
          category: product.category || 'uncategorized',
          sku: product.sku || `SKU-${Date.now()}`,
          isAvailable: !!product.isAvailable,
          image: imageUrl,
          updatedAt: Date.now()
        })

        const { $successToast } = useNuxtApp()
        $successToast('Product updated successfully!')
      } catch (error) {
        const { $failToast } = useNuxtApp()
        $failToast('Failed to update product: ' + error.message)
        throw error
      }
    },

    async deleteProduct(productId) {
      try {
        const config = useRuntimeConfig()
        const db = useDatabase()
        const productRef = dbRef(db, `${config.public.storePrefix}/products/${productId}`)

        const snapshot = await get(productRef)
        const product = snapshot.val()

        if (product && product.image) {
          const publicId = extractPublicId(product.image)
          if (publicId) {
            await deleteImageFromCloudinary(publicId)
          }
        }

        await remove(productRef)
        const { $successToast } = useNuxtApp()
        $successToast('Product deleted successfully!')
      } catch (error) {
        const { $failToast } = useNuxtApp()
        $failToast('Failed to delete product: ' + error.message)
        throw error
      }
    }
  }
})
