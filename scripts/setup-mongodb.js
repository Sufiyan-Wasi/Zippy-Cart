/**
 * Setup script to help configure MongoDB
 * Run: node scripts/setup-mongodb.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 MongoDB Setup Helper\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '../.env.local');
const envExamplePath = path.join(__dirname, '../.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env.local file...');
  
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf-8');
  } else {
    envContent = `# JWT Secret
JWT_SECRET=your-secret-key-change-in-production-${Date.now()}

# MongoDB Connection String
# For local MongoDB: mongodb://localhost:27017/zippy_cart
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/zippy_cart
MONGODB_URI=mongodb://localhost:27017/zippy_cart
MONGODB_DB_NAME=zippy_cart

# Google Custom Search API (optional)
# GOOGLE_API_KEY=your-google-api-key-here
# GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here
`;
  }
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

// Check MongoDB URI
const envContent = fs.readFileSync(envPath, 'utf-8');
const hasMongoURI = envContent.includes('MONGODB_URI=') && 
                    !envContent.includes('MONGODB_URI=mongodb://localhost:27017/zippy_cart') &&
                    !envContent.includes('MONGODB_URI=your-mongodb-uri');

if (!hasMongoURI) {
  console.log('⚠️  MongoDB URI not configured in .env.local');
  console.log('\n📋 To connect MongoDB:');
  console.log('   1. Open .env.local file');
  console.log('   2. Update MONGODB_URI with your connection string:');
  console.log('      - Local: mongodb://localhost:27017/zippy_cart');
  console.log('      - Atlas: mongodb+srv://username:password@cluster.mongodb.net/zippy_cart');
  console.log('\n💡 The project will work without MongoDB (uses in-memory storage)');
  console.log('   But data will be lost on server restart.\n');
} else {
  console.log('✅ MongoDB URI is configured\n');
  console.log('📦 Next steps:');
  console.log('   1. Make sure MongoDB is running');
  console.log('   2. Run migration: npm run migrate:mongodb');
  console.log('   3. View data in MongoDB Compass\n');
}

console.log('🚀 To start the project:');
console.log('   npm run dev\n');


