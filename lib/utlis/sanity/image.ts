import { sanityConfig } from '../generateApiUrl'

interface SanityImageAsset {
  _ref: string
  _type: 'reference'
}

interface SanityImage {
  asset: SanityImageAsset
  hotspot?: {
    x: number
    y: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export function buildImageUrl(image: SanityImage | null | undefined, width?: number, height?: number): string | null {
  if (!image?.asset?._ref) return null

  const { projectId, dataset } = sanityConfig
  const ref = image.asset._ref
  const [, id, dimensions, format] = ref.split('-')

  if (!id || !dimensions || !format) return null

  let url = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}`

  const params = new URLSearchParams()
  
  if (width) params.append('w', width.toString())
  if (height) params.append('h', height.toString())
  if (width || height) params.append('fit', 'max')
  params.append('auto', 'format')

  const queryString = params.toString()
  if (queryString) url += `?${queryString}`

  return url
}

export async function uploadImageToSanity(imageUri: string): Promise<SanityImageAsset | null> {
  try {
    const { projectId, dataset } = sanityConfig
    const token = process.env.EXPO_PUBLIC_SANITY_TOKEN

    if (!token) {
      throw new Error('Sanity token not found')
    }

    const response = await fetch(imageUri)
    const blob = await response.blob()

    const uploadResponse = await fetch(
      `https://${projectId}.api.sanity.io/v2021-03-25/assets/images/${dataset}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': blob.type,
          Authorization: `Bearer ${token}`,
        },
        body: blob,
      }
    )

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await uploadResponse.json()
    
    return {
      _type: 'reference',
      _ref: data.document._id,
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    return null
  }
}
