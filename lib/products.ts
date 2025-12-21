import type { Product } from "./types"

// Categories for products
export const CATEGORIES = ["Electronics", "Home & Kitchen", "Fashion", "Books", "Toys", "Sports"] as const

// Brands for products
export const BRANDS = [
  "Samsung",
  "Apple",
  "Sony",
  "LG",
  "Philips",
  "Prestige",
  "Nike",
  "Adidas",
  "Puma",
  "Levi's",
  "Penguin",
  "HarperCollins",
  "LEGO",
  "Hasbro",
  "Yonex",
  "Cosco",
] as const

// Generate 100 products with realistic data
function generateProducts(): Product[] {
  const products: Product[] = []

  const productData = [
    // Electronics (20 products)
    {
      title: "Samsung Galaxy S24 Ultra",
      category: "Electronics",
      brand: "Samsung",
      price: 124999,
      desc: "Flagship smartphone with S Pen support and 200MP camera",
    },
    {
      title: "Apple iPhone 15 Pro Max",
      category: "Electronics",
      brand: "Apple",
      price: 159900,
      desc: "Premium smartphone with A17 Pro chip and titanium design",
    },
    {
      title: "Sony WH-1000XM5 Headphones",
      category: "Electronics",
      brand: "Sony",
      price: 29990,
      desc: "Industry-leading noise cancelling wireless headphones",
    },
    {
      title: "Samsung 55 inch QLED TV",
      category: "Electronics",
      brand: "Samsung",
      price: 79999,
      desc: "4K QLED Smart TV with Quantum Processor",
    },
    {
      title: "Apple MacBook Air M3",
      category: "Electronics",
      brand: "Apple",
      price: 114900,
      desc: "Thin and light laptop with M3 chip",
    },
    {
      title: "Sony PlayStation 5",
      category: "Electronics",
      brand: "Sony",
      price: 49990,
      desc: "Next-gen gaming console with DualSense controller",
    },
    {
      title: "Samsung Galaxy Watch 6",
      category: "Electronics",
      brand: "Samsung",
      price: 28999,
      desc: "Advanced smartwatch with health monitoring",
    },
    {
      title: "Apple AirPods Pro 2",
      category: "Electronics",
      brand: "Apple",
      price: 24900,
      desc: "Active noise cancelling earbuds with spatial audio",
    },
    {
      title: "LG 43 inch 4K Monitor",
      category: "Electronics",
      brand: "LG",
      price: 45999,
      desc: "Ultra HD monitor for productivity and entertainment",
    },
    {
      title: "Sony Alpha A7 IV Camera",
      category: "Electronics",
      brand: "Sony",
      price: 234990,
      desc: "Full-frame mirrorless camera with 33MP sensor",
    },
    {
      title: "Samsung Galaxy Tab S9",
      category: "Electronics",
      brand: "Samsung",
      price: 72999,
      desc: "Premium Android tablet with S Pen included",
    },
    {
      title: "Apple iPad Pro 12.9",
      category: "Electronics",
      brand: "Apple",
      price: 112900,
      desc: "Professional tablet with M2 chip and Liquid Retina XDR",
    },
    {
      title: "Sony SRS-XB43 Speaker",
      category: "Electronics",
      brand: "Sony",
      price: 14990,
      desc: "Powerful portable Bluetooth speaker with extra bass",
    },
    {
      title: "LG Gram 17 Laptop",
      category: "Electronics",
      brand: "LG",
      price: 134990,
      desc: "Ultra-lightweight 17 inch laptop",
    },
    {
      title: "Samsung T7 SSD 2TB",
      category: "Electronics",
      brand: "Samsung",
      price: 15999,
      desc: "Portable solid state drive with fast transfers",
    },
    {
      title: "Apple Watch Series 9",
      category: "Electronics",
      brand: "Apple",
      price: 41900,
      desc: "Advanced health and fitness smartwatch",
    },
    {
      title: "Sony Bravia 65 inch OLED",
      category: "Electronics",
      brand: "Sony",
      price: 199990,
      desc: "Premium OLED TV with cognitive processor",
    },
    {
      title: "Philips Air Purifier AC2889",
      category: "Electronics",
      brand: "Philips",
      price: 34995,
      desc: "Smart air purifier for large rooms",
    },
    {
      title: "Samsung Soundbar HW-Q990C",
      category: "Electronics",
      brand: "Samsung",
      price: 149990,
      desc: "11.1.4 channel premium soundbar with Dolby Atmos",
    },
    {
      title: "LG ThinQ Refrigerator",
      category: "Electronics",
      brand: "LG",
      price: 89990,
      desc: "Smart side-by-side refrigerator with InstaView",
    },

    // Home & Kitchen (18 products)
    {
      title: "Prestige Electric Kettle",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 1299,
      desc: "1.5L stainless steel electric kettle",
    },
    {
      title: "Philips Mixer Grinder",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 4999,
      desc: "750W mixer grinder with 3 jars",
    },
    {
      title: "Prestige Induction Cooktop",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 2999,
      desc: "2000W induction cooktop with feather touch",
    },
    {
      title: "Philips Air Fryer XXL",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 24995,
      desc: "Premium airfryer with fat removal technology",
    },
    {
      title: "Prestige Pressure Cooker 5L",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 2499,
      desc: "Stainless steel pressure cooker with safety features",
    },
    {
      title: "Philips Hand Blender",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 3495,
      desc: "700W hand blender with multiple attachments",
    },
    {
      title: "Prestige Non-Stick Cookware Set",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 5999,
      desc: "12-piece non-stick cookware set",
    },
    {
      title: "Philips Coffee Maker",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 7999,
      desc: "Drip coffee maker with thermal carafe",
    },
    {
      title: "Prestige Gas Stove 4 Burner",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 8999,
      desc: "4 burner glass top gas stove",
    },
    {
      title: "Philips Juicer Mixer",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 6999,
      desc: "Centrifugal juicer with mixer attachment",
    },
    {
      title: "LG Microwave Oven 32L",
      category: "Home & Kitchen",
      brand: "LG",
      price: 16990,
      desc: "Convection microwave with auto cook menu",
    },
    {
      title: "Philips Rice Cooker",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 4495,
      desc: "1.8L rice cooker with keep warm function",
    },
    {
      title: "Prestige IDOL Cookware",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 7499,
      desc: "Premium stainless steel cookware set",
    },
    {
      title: "Philips Vacuum Cleaner",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 12999,
      desc: "Bagless vacuum cleaner with PowerCyclone",
    },
    {
      title: "LG Washing Machine 8kg",
      category: "Home & Kitchen",
      brand: "LG",
      price: 42990,
      desc: "Front load washing machine with AI DD",
    },
    {
      title: "Philips Iron",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 2999,
      desc: "Steam iron with SteamGlide soleplate",
    },
    {
      title: "Prestige Food Processor",
      category: "Home & Kitchen",
      brand: "Prestige",
      price: 8499,
      desc: "1000W food processor with multiple functions",
    },
    {
      title: "Philips Water Purifier",
      category: "Home & Kitchen",
      brand: "Philips",
      price: 15999,
      desc: "RO+UV water purifier with 7L storage",
    },

    // Fashion (18 products)
    {
      title: "Nike Air Max 270",
      category: "Fashion",
      brand: "Nike",
      price: 13995,
      desc: "Lifestyle sneakers with Max Air cushioning",
    },
    {
      title: "Adidas Ultraboost 23",
      category: "Fashion",
      brand: "Adidas",
      price: 16999,
      desc: "Premium running shoes with Boost midsole",
    },
    {
      title: "Puma RS-X Sneakers",
      category: "Fashion",
      brand: "Puma",
      price: 8999,
      desc: "Retro-inspired chunky sneakers",
    },
    {
      title: "Levi's 501 Original Jeans",
      category: "Fashion",
      brand: "Levi's",
      price: 4999,
      desc: "Classic straight fit denim jeans",
    },
    {
      title: "Nike Dri-FIT T-Shirt",
      category: "Fashion",
      brand: "Nike",
      price: 1995,
      desc: "Moisture-wicking sports t-shirt",
    },
    {
      title: "Adidas Originals Hoodie",
      category: "Fashion",
      brand: "Adidas",
      price: 4999,
      desc: "Classic trefoil hoodie in cotton blend",
    },
    {
      title: "Puma Track Pants",
      category: "Fashion",
      brand: "Puma",
      price: 2999,
      desc: "Comfortable track pants with side stripes",
    },
    {
      title: "Levi's Trucker Jacket",
      category: "Fashion",
      brand: "Levi's",
      price: 7999,
      desc: "Iconic denim trucker jacket",
    },
    {
      title: "Nike Air Force 1",
      category: "Fashion",
      brand: "Nike",
      price: 8295,
      desc: "Classic white leather sneakers",
    },
    {
      title: "Adidas Stan Smith",
      category: "Fashion",
      brand: "Adidas",
      price: 7999,
      desc: "Iconic tennis-inspired sneakers",
    },
    { title: "Puma Suede Classic", category: "Fashion", brand: "Puma", price: 6999, desc: "Timeless suede sneakers" },
    {
      title: "Levi's Slim Fit Shirt",
      category: "Fashion",
      brand: "Levi's",
      price: 3499,
      desc: "Casual slim fit cotton shirt",
    },
    { title: "Nike Pro Shorts", category: "Fashion", brand: "Nike", price: 1795, desc: "Compression training shorts" },
    {
      title: "Adidas Running Jacket",
      category: "Fashion",
      brand: "Adidas",
      price: 5499,
      desc: "Lightweight windproof running jacket",
    },
    { title: "Puma Backpack", category: "Fashion", brand: "Puma", price: 2499, desc: "Spacious everyday backpack" },
    {
      title: "Levi's Leather Belt",
      category: "Fashion",
      brand: "Levi's",
      price: 1999,
      desc: "Genuine leather belt with classic buckle",
    },
    { title: "Nike Sports Bra", category: "Fashion", brand: "Nike", price: 2495, desc: "Medium support sports bra" },
    { title: "Adidas Cap", category: "Fashion", brand: "Adidas", price: 1299, desc: "Classic baseball cap with logo" },

    // Books (16 products)
    {
      title: "The Psychology of Money",
      category: "Books",
      brand: "HarperCollins",
      price: 399,
      desc: "Timeless lessons on wealth and happiness by Morgan Housel",
    },
    {
      title: "Atomic Habits",
      category: "Books",
      brand: "Penguin",
      price: 499,
      desc: "Build good habits and break bad ones by James Clear",
    },
    {
      title: "Rich Dad Poor Dad",
      category: "Books",
      brand: "Penguin",
      price: 349,
      desc: "Financial education classic by Robert Kiyosaki",
    },
    {
      title: "Sapiens",
      category: "Books",
      brand: "HarperCollins",
      price: 599,
      desc: "A brief history of humankind by Yuval Noah Harari",
    },
    {
      title: "Think and Grow Rich",
      category: "Books",
      brand: "Penguin",
      price: 299,
      desc: "Personal success literature by Napoleon Hill",
    },
    {
      title: "The Alchemist",
      category: "Books",
      brand: "HarperCollins",
      price: 350,
      desc: "Paulo Coelho's inspiring tale of following your dreams",
    },
    {
      title: "Start With Why",
      category: "Books",
      brand: "Penguin",
      price: 450,
      desc: "Leadership book by Simon Sinek",
    },
    {
      title: "Deep Work",
      category: "Books",
      brand: "HarperCollins",
      price: 499,
      desc: "Rules for focused success by Cal Newport",
    },
    {
      title: "The 7 Habits of Highly Effective People",
      category: "Books",
      brand: "Penguin",
      price: 549,
      desc: "Stephen Covey's classic self-help book",
    },
    {
      title: "Ikigai",
      category: "Books",
      brand: "Penguin",
      price: 350,
      desc: "Japanese secret to a long and happy life",
    },
    {
      title: "The Subtle Art of Not Giving",
      category: "Books",
      brand: "HarperCollins",
      price: 399,
      desc: "Counterintuitive approach to living a good life",
    },
    { title: "Zero to One", category: "Books", brand: "Penguin", price: 499, desc: "Notes on startups by Peter Thiel" },
    {
      title: "The Lean Startup",
      category: "Books",
      brand: "HarperCollins",
      price: 550,
      desc: "Eric Ries on building successful businesses",
    },
    {
      title: "Man's Search for Meaning",
      category: "Books",
      brand: "Penguin",
      price: 299,
      desc: "Viktor Frankl's memoir and psychological insights",
    },
    {
      title: "The Power of Now",
      category: "Books",
      brand: "Penguin",
      price: 399,
      desc: "Eckhart Tolle's guide to spiritual enlightenment",
    },
    {
      title: "Thinking Fast and Slow",
      category: "Books",
      brand: "HarperCollins",
      price: 599,
      desc: "Daniel Kahneman on decision making",
    },

    // Toys (14 products)
    {
      title: "LEGO City Police Station",
      category: "Toys",
      brand: "LEGO",
      price: 6999,
      desc: "899-piece police station building set",
    },
    {
      title: "Hasbro Monopoly Classic",
      category: "Toys",
      brand: "Hasbro",
      price: 1299,
      desc: "Classic family board game",
    },
    {
      title: "LEGO Technic Porsche 911",
      category: "Toys",
      brand: "LEGO",
      price: 14999,
      desc: "1458-piece model car building set",
    },
    {
      title: "Hasbro Nerf Elite Blaster",
      category: "Toys",
      brand: "Hasbro",
      price: 1999,
      desc: "Motorized dart blaster with 25-dart drum",
    },
    {
      title: "LEGO Star Wars X-Wing",
      category: "Toys",
      brand: "LEGO",
      price: 5999,
      desc: "474-piece starfighter building set",
    },
    {
      title: "Hasbro Play-Doh Set",
      category: "Toys",
      brand: "Hasbro",
      price: 799,
      desc: "Creative modeling compound set with tools",
    },
    {
      title: "LEGO Creator 3-in-1 House",
      category: "Toys",
      brand: "LEGO",
      price: 3999,
      desc: "739-piece building set with 3 build options",
    },
    {
      title: "Hasbro Scrabble",
      category: "Toys",
      brand: "Hasbro",
      price: 899,
      desc: "Classic word game for the family",
    },
    {
      title: "LEGO Friends Heartlake",
      category: "Toys",
      brand: "LEGO",
      price: 8499,
      desc: "1513-piece friendship house set",
    },
    {
      title: "Hasbro Transformers Figure",
      category: "Toys",
      brand: "Hasbro",
      price: 2999,
      desc: "Converting robot action figure",
    },
    {
      title: "LEGO Harry Potter Hogwarts",
      category: "Toys",
      brand: "LEGO",
      price: 11999,
      desc: "6020-piece castle building set",
    },
    { title: "Hasbro Jenga", category: "Toys", brand: "Hasbro", price: 699, desc: "Classic stacking block game" },
    {
      title: "LEGO Architecture Taj Mahal",
      category: "Toys",
      brand: "LEGO",
      price: 9999,
      desc: "2022-piece architectural model",
    },
    {
      title: "Hasbro Operation Game",
      category: "Toys",
      brand: "Hasbro",
      price: 1499,
      desc: "Classic electronic skill game",
    },

    // Sports (14 products)
    {
      title: "Yonex Badminton Racket",
      category: "Sports",
      brand: "Yonex",
      price: 4999,
      desc: "Professional grade badminton racket",
    },
    { title: "Cosco Cricket Bat", category: "Sports", brand: "Cosco", price: 2999, desc: "English willow cricket bat" },
    { title: "Nike Football", category: "Sports", brand: "Nike", price: 2499, desc: "Official match football" },
    { title: "Adidas Basketball", category: "Sports", brand: "Adidas", price: 1999, desc: "Indoor/outdoor basketball" },
    {
      title: "Yonex Shuttlecock Set",
      category: "Sports",
      brand: "Yonex",
      price: 999,
      desc: "Feather shuttlecocks pack of 12",
    },
    { title: "Cosco Tennis Racket", category: "Sports", brand: "Cosco", price: 1999, desc: "Graphite tennis racket" },
    {
      title: "Nike Running Shoes",
      category: "Sports",
      brand: "Nike",
      price: 10995,
      desc: "Lightweight running shoes with zoom air",
    },
    {
      title: "Adidas Football Boots",
      category: "Sports",
      brand: "Adidas",
      price: 8999,
      desc: "Predator firm ground boots",
    },
    {
      title: "Yonex Badminton Bag",
      category: "Sports",
      brand: "Yonex",
      price: 2499,
      desc: "6-racket badminton kit bag",
    },
    {
      title: "Cosco Table Tennis Set",
      category: "Sports",
      brand: "Cosco",
      price: 1499,
      desc: "Table tennis racket set with balls",
    },
    {
      title: "Nike Training Gloves",
      category: "Sports",
      brand: "Nike",
      price: 1999,
      desc: "Weightlifting training gloves",
    },
    { title: "Adidas Yoga Mat", category: "Sports", brand: "Adidas", price: 2499, desc: "Premium non-slip yoga mat" },
    { title: "Puma Gym Bag", category: "Sports", brand: "Puma", price: 2999, desc: "Spacious gym and sports bag" },
    {
      title: "Cosco Fitness Dumbbells",
      category: "Sports",
      brand: "Cosco",
      price: 3999,
      desc: "Adjustable dumbbell set 10kg",
    },
  ]

  productData.forEach((item, index) => {
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    products.push({
      id: `product-${index + 1}`,
      title: item.title,
      slug,
      description: item.desc,
      category: item.category,
      brand: item.brand,
      priceINR: item.price,
      currency: "INR",
      stock: Math.floor(Math.random() * 200) + 1,
      images: [
        `https://picsum.photos/seed/${slug}-1/600/400`,
        `https://picsum.photos/seed/${slug}-2/600/400`,
        `https://picsum.photos/seed/${slug}-3/600/400`,
      ],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)),
    })
  })

  return products
}

export const PRODUCTS: Product[] = generateProducts()

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug)
}

// Helper function to get product by ID
export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id)
}

// Helper function to filter and paginate products
export function getFilteredProducts(options: {
  page?: number
  limit?: number
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
}) {
  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    brand = "",
    minPrice = 0,
    maxPrice = Number.POSITIVE_INFINITY,
    sort = "newest",
  } = options

  let filtered = [...PRODUCTS]

  // Search filter
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower),
    )
  }

  // Category filter
  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }

  // Brand filter
  if (brand) {
    filtered = filtered.filter((p) => p.brand === brand)
  }

  // Price range filter
  filtered = filtered.filter((p) => p.priceINR >= minPrice && p.priceINR <= maxPrice)

  // Sort
  switch (sort) {
    case "price-asc":
    case "price_asc":
      filtered.sort((a, b) => a.priceINR - b.priceINR)
      break
    case "price-desc":
    case "price_desc":
      filtered.sort((a, b) => b.priceINR - a.priceINR)
      break
    case "name-asc":
    case "name_asc":
      filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "name-desc":
    case "name_desc":
      filtered.sort((a, b) => b.title.localeCompare(a.title))
      break
    case "newest":
    default:
      filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  // Pagination
  const totalProducts = filtered.length
  const totalPages = Math.ceil(totalProducts / limit)
  const startIndex = (page - 1) * limit
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit)

  return {
    products: paginatedProducts,
    totalProducts,
    totalPages,
    currentPage: page,
  }
}
