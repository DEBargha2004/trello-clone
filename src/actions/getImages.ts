'use server'

import { ImageApiData } from '@/types/image-api'

export default async function getImages () {
  const url = `https://pixabay.com/api/?key=${process.env.IMAGE_API_KEY}&q=beautiful+background&image_type=photo`

  let response = await fetch(url, {
    next: { revalidate: 3600 }
  })

  response = await response.json()

  return response
}
