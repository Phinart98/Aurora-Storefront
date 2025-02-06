import { createToaster } from '@meforma/vue-toaster'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const toaster = createToaster({
    position: 'bottom-left',
    maxToasts: 5
  })

  // Custom success toast using a Bootstrap icon
  const successToast = (message: string) => {
    toaster.show(
      `
      <div class="flex items-center">
        <i class="bi bi-check-circle-fill text-white mr-2"></i>
        <span>${message}</span>
      </div>
      `,
      {
        type: 'success',
        pauseOnHover: true,
        duration: 3000,
        className: 'bg-green-500 text-white p-4 rounded shadow-md w-[300px] my-2'
      }
    )
  }

  // Custom error toast using a Bootstrap icon
  const failToast = (message: string) => {
    toaster.show(
      `
      <div class="flex items-center">
        <i class="bi bi-x-circle-fill text-white mr-2"></i>
        <span>${message}</span>
      </div>
      `,
      {
        type: 'error',
        duration: 3000,
        className: 'bg-red-500 text-white p-4 rounded shadow-md w-[300px] my-2'
      }
    )
  }

  // Custom warning toast using a Bootstrap icon
  const warnToast = (message: string) => {
    toaster.show(
      `
      <div class="flex items-center">
        <i class="bi bi-exclamation-triangle-fill text-white mr-2"></i>
        <span>${message}</span>
      </div>
      `,
      {
        type: 'warning',
        duration: 3000,
        className: 'bg-yellow-500 text-white p-4 rounded shadow-md w-[300px] my-2'
      }
    )
  }

  nuxtApp.provide('successToast', successToast)
  nuxtApp.provide('failToast', failToast)
  nuxtApp.provide('warnToast', warnToast)
})
