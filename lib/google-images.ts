/**
 * Google Custom Search API for product images
 * Requires GOOGLE_API_KEY and GOOGLE_SEARCH_ENGINE_ID in .env
 */

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID

interface GoogleImageResult {
  link: string
  title: string
  displayLink: string
}

interface GoogleSearchResponse {
  items?: Array<{
    link: string
    title: string
    displayLink: string
    image?: {
      contextLink: string
    }
  }>
}

/**
 * Search for product images using Google Custom Search API
 */
export async function searchProductImages(
  productTitle: string,
  category?: string,
  count: number = 3
): Promise<string[]> {
  // If API keys are not configured, use fallback Unsplash images
  if (!GOOGLE_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.warn("Google API keys not configured, using fallback images")
    return getFallbackImages(productTitle, count)
  }

  try {
    const query = `${productTitle} ${category || ""} product image`.trim()
    const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=${count}&safe=active`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`)
    }

    const data: GoogleSearchResponse = await response.json()
    
    if (!data.items || data.items.length === 0) {
      return getFallbackImages(productTitle, count)
    }

    return data.items.slice(0, count).map((item) => item.link)
  } catch (error) {
    console.error("Error fetching Google images:", error)
    return getFallbackImages(productTitle, count)
  }
}

/**
 * Fallback to Unsplash images if Google API fails or is not configured
 */
function getFallbackImages(productTitle: string, count: number): string[] {
  const seed = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const images: string[] = []
  
  for (let i = 1; i <= count; i++) {
    // Using Unsplash Source API for product images
    images.push(`https://source.unsplash.com/800x600/?${encodeURIComponent(productTitle)},product&sig=${seed}-${i}`)
  }
  
  return images
}

/**
 * Batch update product images using Google Custom Search
 */
export async function updateProductImages(
  products: Array<{ id: string; title: string; category: string }>
): Promise<Map<string, string[]>> {
  const imageMap = new Map<string, string[]>()
  
  for (const product of products) {
    try {
      const images = await searchProductImages(product.title, product.category, 3)
      imageMap.set(product.id, images)
      
      // Rate limiting - wait 100ms between requests
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Failed to get images for ${product.title}:`, error)
      imageMap.set(product.id, getFallbackImages(product.title, 3))
    }
  }
  
  return imageMap
}

