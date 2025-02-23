export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client && to.path.startsWith('/admin')) {
    const session = useCookie('admin-session')
    if (!session.value && to.path !== '/admin/login') {
      return navigateTo('/admin/login')
    }
  }
})
