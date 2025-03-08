export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  const setFavicon = () => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link')
    link.type = 'image/x-icon'
    link.rel = 'icon'
    link.href = config.public.faviconUrl
    document.getElementsByTagName('head')[0].appendChild(link)
  }
  
  if (process.client) {
    setFavicon()
  }
})
