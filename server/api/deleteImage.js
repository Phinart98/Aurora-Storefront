import { createHash } from 'crypto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  console.log('Config values:', {
    apiKey: config.cloudinaryApiKey,
    cloudName: config.public.cloudinaryCloudName
  })
  
  const { publicId } = await readBody(event)
  const timestamp = Math.floor(Date.now() / 1000)
  
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${config.cloudinaryApiSecret}`
  const signature = createHash('sha1').update(stringToSign).digest('hex')
  
  const formData = new URLSearchParams()
  formData.append('public_id', publicId)
  formData.append('signature', signature)
  formData.append('api_key', config.cloudinaryApiKey)
  formData.append('timestamp', timestamp.toString())
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/destroy`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    }
  )
  
  const result = await response.json()
  console.log('Cloudinary Response:', result)
  
  if (result.error) {
    throw createError({
      statusCode: 400,
      message: result.error.message
    })
  }
  
  return { success: true, result }
})
