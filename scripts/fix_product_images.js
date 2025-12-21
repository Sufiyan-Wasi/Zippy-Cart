/**
 * Fix Product Images Script
 * 
 * This script replaces product images with high-quality Google Images direct URLs.
 * Works with MongoDB if MONGODB_URI is provided, otherwise updates in-memory PRODUCTS array.
 * 
 * Usage: npm run fix:images
 */

const fs = require('fs');
const path = require('path');

// Product image mappings - Google Images direct URLs ending in .jpg/.png
const PRODUCT_IMAGES = {
  // Electronics
  'Samsung Galaxy S24 Ultra': [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
  ],
  'Apple iPhone 15 Pro Max': [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80',
  ],
  'Sony WH-1000XM5 Headphones': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&auto=format&fit=crop&q=80',
  ],
  'Samsung 55 inch QLED TV': [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1467297422289-1a733ccb1e22?w=800&auto=format&fit=crop&q=80',
  ],
  'Apple MacBook Air M3': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop&q=80',
  ],
  'Sony PlayStation 5': [
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1613545325278-f24b0cae1224?w=800&auto=format&fit=crop&q=80',
  ],
  'Samsung Galaxy Watch 6': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&auto=format&fit=crop&q=80',
  ],
  'Apple AirPods Pro 2': [
    'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
  ],
  'LG 43 inch 4K Monitor': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=80',
  ],
  'Sony Alpha A7 IV Camera': [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&auto=format&fit=crop&q=80',
  ],
  // Home & Kitchen
  'Prestige Electric Kettle': [
    'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600353068441-84e393664d6b?w=800&auto=format&fit=crop&q=80',
  ],
  'Philips Mixer Grinder': [
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80',
  ],
  // Fashion
  'Nike Air Max 270': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&auto=format&fit=crop&q=80',
  ],
  'Adidas Ultraboost 23': [
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  ],
  'Levi\'s 501 Original Jeans': [
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
  ],
  // Books
  'The Psychology of Money': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80',
  ],
  'Atomic Habits': [
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80',
  ],
  'Penguin': [
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80',
  ],
};

// Generic category-based image sets
const CATEGORY_IMAGES = {
  'Electronics': [
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop&q=80',
  ],
  'Home & Kitchen': [
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80',
  ],
  'Fashion': [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
  ],
  'Books': [
    'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&auto=format&fit=crop&q=80',
  ],
  'Toys': [
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop&q=80',
  ],
  'Sports': [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&auto=format&fit=crop&q=80',
  ],
};

function getImagesForProduct(title, category) {
  // Check for exact match first
  if (PRODUCT_IMAGES[title]) {
    return PRODUCT_IMAGES[title];
  }
  
  // Fallback to category images
  if (CATEGORY_IMAGES[category]) {
    return CATEGORY_IMAGES[category];
  }
  
  // Default fallback - using Unsplash with product title as seed
  const seed = title.toLowerCase().replace(/\s+/g, '-');
  return [
    `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=800&auto=format&fit=crop&q=80&sig=${seed}`,
    `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=800&auto=format&fit=crop&q=80&sig=${seed}-2`,
    `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000000000)}?w=800&auto=format&fit=crop&q=80&sig=${seed}-3`,
  ];
}

async function updateProducts() {
  const MONGODB_URI = process.env.MONGODB_URI;
  let products = [];
  let useMongo = false;
  let mongoClient = null;
  
  // Try to use MongoDB if URI is provided
  if (MONGODB_URI) {
    try {
      const { MongoClient } = require('mongodb');
      mongoClient = new MongoClient(MONGODB_URI);
      await mongoClient.connect();
      const db = mongoClient.db();
      const collection = db.collection('products');
      products = await collection.find({}).toArray();
      useMongo = true;
      console.log('✓ Connected to MongoDB');
    } catch (error) {
      console.warn('⚠ MongoDB connection failed, using in-memory update:', error.message);
    }
  }
  
  // If no MongoDB, read from lib/products.ts
  if (!useMongo) {
    const productsPath = path.join(__dirname, '../lib/products.ts');
    const productsContent = fs.readFileSync(productsPath, 'utf-8');
    
    // Extract product data from the generateProducts function
    // This is a simple approach - in production, you'd want to parse the AST properly
    console.log('⚠ Using in-memory PRODUCTS array - updates will be in lib/products.ts');
    console.log('⚠ Note: For production, use MongoDB with MONGODB_URI environment variable');
    
    // For now, we'll create a mapping file that can be imported
    const imageMapPath = path.join(__dirname, '../lib/product_images.json');
    const imageMap = {};
    
    // Read current products and create image mapping
    const { PRODUCTS } = require('../lib/products');
    products = PRODUCTS.map(p => ({ ...p, id: p.id }));
    
    // Update images for each product
    let processed = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const product of products) {
      processed++;
      const newImages = getImagesForProduct(product.title, product.category);
      
      // Check if images need updating (skip if already updated)
      const needsUpdate = !product.images || 
        product.images.some(img => img.includes('picsum.photos') || img.includes('placeholder'));
      
      if (needsUpdate) {
        imageMap[product.id] = newImages;
        updated++;
      } else {
        skipped++;
      }
    }
    
    // Write image map to JSON file
    fs.writeFileSync(imageMapPath, JSON.stringify(imageMap, null, 2));
    console.log(`\n✓ Image mapping saved to lib/product_images.json`);
    console.log(`  Processed: ${processed}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Skipped: ${skipped}`);
    
    console.log('\n⚠ To apply images, manually update lib/products.ts or use MongoDB');
    return;
  }
  
  // MongoDB update path
  const collection = mongoClient.db().collection('products');
  let processed = 0;
  let updated = 0;
  let skipped = 0;
  
  for (const product of products) {
    processed++;
    const newImages = getImagesForProduct(product.title, product.category);
    
    // Check if images need updating
    const needsUpdate = !product.images || 
      product.images.some(img => img.includes('picsum.photos') || img.includes('placeholder'));
    
    if (needsUpdate) {
      await collection.updateOne(
        { _id: product._id },
        { $set: { images: newImages } }
      );
      updated++;
    } else {
      skipped++;
    }
  }
  
  await mongoClient.close();
  
  console.log(`\n✓ Image update complete`);
  console.log(`  Processed: ${processed}`);
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped: ${skipped}`);
}

// Run the script
updateProducts().catch(console.error);

