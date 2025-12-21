# Zippy Cart - E-Commerce Platform

A full-featured e-commerce platform built with Next.js, React, and TypeScript. Features a **black and white minimalist design** with MongoDB integration and Google Custom Search API for product images.

## 🎨 Black & White Minimalist Theme

The entire UI has been redesigned with a clean black and white color scheme:
- **Pure black (#000000)** for primary actions and text
- **White (#ffffff)** for backgrounds
- **Grayscale accents** for secondary elements
- **Minimal borders** and clean typography

## 🗄️ MongoDB Integration

The project now supports MongoDB for persistent data storage. All data (users, products, orders) is stored in MongoDB and visible in MongoDB Compass.

### MongoDB Setup

1. **Install MongoDB** (if not already installed):
   - Local: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Cloud: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

2. **Configure Connection**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB connection string:
   ```env
   MONGODB_URI=mongodb://localhost:27017/zippy_cart
   MONGODB_DB_NAME=zippy_cart
   ```
   
   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zippy_cart
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Migrate Data**:
   ```bash
   npm run migrate:mongodb
   ```
   
   This will:
   - Create the admin user in MongoDB
   - Migrate all existing products
   - Migrate all existing orders
   - Migrate all existing users

5. **View in MongoDB Compass**:
   - Open MongoDB Compass
   - Connect using your `MONGODB_URI`
   - You'll see the `zippy_cart` database with collections:
     - `users` - All user accounts
     - `products` - Product catalog
     - `orders` - All orders

## 🖼️ Google Custom Search API for Product Images

Product images are now fetched using Google Custom Search API for relevant, high-quality product images.

### Setup Google Custom Search API

1. **Get API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new API key
   - Enable "Custom Search API"

2. **Create Custom Search Engine**:
   - Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
   - Create a new search engine
   - Set it to search the entire web
   - Copy the Search Engine ID

3. **Add to .env**:
   ```env
   GOOGLE_API_KEY=your-api-key-here
   GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id-here
   ```

4. **Update Product Images**:
   ```bash
   npm run update:images
   ```
   
   This will fetch relevant product images from Google for all products.

**Note**: If Google API keys are not configured, the system will fall back to Unsplash images.

## Features

- 🛍️ **Product Catalog** - Browse products by category, brand, and price
- 🛒 **Shopping Cart** - Add products to cart with persistent storage
- 💳 **Payment Integration** - Support for Stripe and UPI payments
- 📦 **Order Management** - Track orders with status updates
- 👤 **User Authentication** - Secure login and registration
- 🎛️ **Admin Dashboard** - Comprehensive admin panel with analytics
- 📊 **Analytics & Charts** - Sales, orders, and returns visualization
- 🔐 **Role-Based Access** - Admin and user roles with permissions
- 🗄️ **MongoDB Integration** - Persistent data storage
- 🖼️ **Google Images** - Relevant product images via Google Custom Search

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components (Black & White theme)
- **Database**: MongoDB with Mongoose
- **Charts**: Recharts
- **Authentication**: JWT with httpOnly cookies
- **Payments**: Stripe integration
- **Images**: Google Custom Search API

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-commerce-site-generation
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- `MONGODB_URI` - Your MongoDB connection string
- `GOOGLE_API_KEY` - (Optional) Google Custom Search API key
- `GOOGLE_SEARCH_ENGINE_ID` - (Optional) Google Search Engine ID
- `JWT_SECRET` - Secret for JWT tokens

4. Migrate data to MongoDB:
```bash
npm run migrate:mongodb
```

5. (Optional) Update product images:
```bash
npm run update:images
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

**Admin Email**: sufiyanw026@gmail.com  
**Admin Password**: WasiSufiyan026

After logging in as admin, you'll be automatically redirected to `/admin` dashboard.

## Database Collections

### Users Collection
- `id` - Unique user ID
- `name` - User's full name
- `email` - User's email (unique)
- `passwordHash` - Bcrypt hashed password
- `role` - "user" or "admin"
- `createdAt` - Account creation date
- `lastLogin` - Last login timestamp

### Products Collection
- `id` - Unique product ID
- `title` - Product name
- `slug` - URL-friendly identifier
- `description` - Product description
- `category` - Product category
- `brand` - Product brand
- `priceINR` - Price in Indian Rupees
- `stock` - Available stock
- `images` - Array of image URLs
- `createdAt` - Product creation date

### Orders Collection
- `id` - Unique order ID
- `userId` - User who placed the order
- `userEmail` - User's email
- `orderItems` - Array of ordered items
- `shippingAddress` - Delivery address
- `paymentMethod` - Payment method used
- `totalPriceINR` - Total order amount
- `isPaid` - Payment status
- `status` - Order status (pending, processing, shipped, delivered, cancelled)
- `isRefunded` - Refund status
- `refundAmountINR` - Refunded amount
- `createdAt` - Order creation date

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run migrate:mongodb` - Migrate data from in-memory to MongoDB
- `npm run update:images` - Update product images using Google API

## MongoDB Compass Connection

To view your database in MongoDB Compass:

1. **Local MongoDB**:
   - Connection String: `mongodb://localhost:27017`
   - Database: `zippy_cart`

2. **MongoDB Atlas**:
   - Use the connection string from Atlas dashboard
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/zippy_cart`

3. **In MongoDB Compass**:
   - Click "New Connection"
   - Paste your connection string
   - Click "Connect"
   - Navigate to `zippy_cart` database
   - View collections: `users`, `products`, `orders`

## Environment Variables

```env
# Required
JWT_SECRET=your-secret-key-change-in-production
MONGODB_URI=mongodb://localhost:27017/zippy_cart
MONGODB_DB_NAME=zippy_cart

# Optional (for Google Images)
GOOGLE_API_KEY=your-google-api-key
GOOGLE_SEARCH_ENGINE_ID=your-search-engine-id

# Optional (for Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## Migration Notes

- The migration script preserves existing data
- Admin user is automatically created if it doesn't exist
- Products, orders, and users are migrated without duplicates
- The system falls back to in-memory storage if MongoDB is not configured

## Security Notes

⚠️ **Important**: 
- Change the admin password before production
- Use strong JWT_SECRET in production
- Secure your MongoDB connection (use authentication)
- Keep Google API keys private
- Use environment variables for all secrets

## License

This project is for demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.
