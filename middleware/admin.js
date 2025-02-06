export default defineNuxtRouteMiddleware((to) => {
  if (process.client && to.path === '/admin') {
    const username = window.prompt('Enter username:')
    const password = window.prompt('Enter password:')
    
    if (username !== 'admin' || password !== 'admin') {
      return navigateTo('/')
    }
  }
})
