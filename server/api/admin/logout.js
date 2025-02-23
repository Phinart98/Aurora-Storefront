export default defineEventHandler((event) => {
  deleteCookie(event, 'admin-session')
  return { success: true }
})
