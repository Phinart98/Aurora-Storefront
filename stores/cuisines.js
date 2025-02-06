import { defineStore } from 'pinia'
import { useDatabase } from 'vuefire'
import { ref as dbRef, push, onValue, remove, update } from 'firebase/database'

export const useCuisineStore = defineStore('cuisines', {
  state: () => ({
    list: []
  }),

  actions: {
    fetchCuisines() {
      const db = useDatabase()
      const cuisinesRef = dbRef(db, 'cuisines')
      
      onValue(cuisinesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          this.list = Object.entries(data).map(([id, cuisine]) => ({
            id,
            ...cuisine
          }))
        } else {
          this.list = []
        }
      })
    },

    async addCuisine(cuisine, imageFile) {
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
        const cuisinesRef = dbRef(db, 'cuisines')
        
        const cuisineData = {
          name: cuisine.name,
          description: cuisine.description,
          price: Number(cuisine.price),
          isAvailable: !!cuisine.isAvailable,
          image: uploadResult.secure_url,
          createdAt: Date.now()
        }
        
        await push(cuisinesRef, cuisineData)
        const { $successToast } = useNuxtApp()
        $successToast('Cuisine added successfully!')
        return { success: true }
      } catch (error) {
        const { $failToast } = useNuxtApp()
        $failToast('Failed to add cuisine: ' + error.message)
        throw error
      }
    },

    async updateCuisine(id, cuisine, imageFile) {
      try {
        let imageUrl = cuisine.image

        // Only upload a new image if imageFile is provided and has size > 0
        if (imageFile && imageFile.size > 0) {
          // Delete the old image if present
          if (cuisine.image) {
            const publicId = extractPublicId(cuisine.image)
            await deleteImageFromCloudinary(publicId)
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

        const db = useDatabase()
        const cuisineRef = dbRef(db, `cuisines/${id}`)
        await update(cuisineRef, {
          name: cuisine.name,
          description: cuisine.description,
          price: Number(cuisine.price),
          isAvailable: !!cuisine.isAvailable,
          image: imageUrl,
          updatedAt: Date.now()
        })

        const { $successToast } = useNuxtApp()
        $successToast('Cuisine updated successfully!')
      } catch (error) {
        const { $failToast } = useNuxtApp()
        $failToast('Failed to update cuisine: ' + error.message)
        throw error
      }
    },

    async deleteCuisine(id) {
      try {
        // Retrieve the cuisine from state to check for an image.
        const cuisine = this.list.find(c => c.id === id)
        if (cuisine && cuisine.image) {
          const publicId = extractPublicId(cuisine.image)
          await deleteImageFromCloudinary(publicId)
        }
        const db = useDatabase()
        const cuisineRef = dbRef(db, `cuisines/${id}`)
        await remove(cuisineRef)
        const { $successToast } = useNuxtApp()
        $successToast('Cuisine deleted successfully!')
      } catch (error) {
        const { $failToast } = useNuxtApp()
        $failToast('Failed to delete cuisine: ' + error.message)
        throw error
      }
    }
  }
})

// Helper: Extract Cloudinary public ID from full URL.
// Assumes URL similar to: https://res.cloudinary.com/<cloudName>/image/upload/v12345678/publicId.ext
function extractPublicId(url) {
  const parts = url.split('/')
  const lastPart = parts[parts.length - 1]
  return lastPart.split('.')[0]
}

// Helper: Delete image via our secure API endpoint.
async function deleteImageFromCloudinary(publicId) {
  await fetch('/api/deleteImage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId })
  })
}
