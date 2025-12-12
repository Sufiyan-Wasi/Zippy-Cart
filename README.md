# Zippy Cart - E-Commerce Platform

A full-featured e-commerce platform built with Next.js, React, and TypeScript. Includes admin dashboard, product management, order processing, and payment integration.

## 🎨 Amazon-Style UI Redesign (Latest Update)

### Complete UI Overhaul
- ✅ **Amazon-Inspired Design**: Complete redesign to match Amazon's layout and feel while keeping "Zippy Cart" branding
- ✅ **Luxury Theme**: Amazon-style color palette - Primary Blue (#0b5ed7), Gold Accent (#ffb700), Light Gray backgrounds
- ✅ **Product Images**: Updated with high-quality Google Images (Unsplash direct URLs)
- ✅ **Fixed Filters**: Complete filter system with working category, brand, price range, and sorting
- ✅ **Responsive Design**: Mobile-first responsive layout that works perfectly on all devices

### New Components
- **StarsRating Component**: Amazon-style star ratings with review counts
- **Amazon-Style Header**: Large search bar, navigation icons, cart badge
- **Amazon-Style Product Cards**: Tall product images, ratings, prices, ZippyCart+ badges
- **Collapsible Filter Sidebar**: Amazon-style filter panel with collapsible sections
- **Product Image Gallery**: Large zoomable product images with thumbnail navigation

## Recent Updates (Previous Changelog)

### Theme & UI Improvements
- ✅ **Blue Theme**: Updated global UI theme to blue (primary color #2563eb / Tailwind blue-600) across all components
- ✅ **Responsive Design**: Improved mobile-first responsive layout with proper breakpoints (1 col xs, 2 sm, 3 md, 4 lg for product grid)
- ✅ **Polished UI**: Enhanced spacing, typography, accessible controls, improved product cards with blue price badges

### Product Filters & Sorting
- ✅ **Fixed Filters**: Complete filter UI with working Apply/Clear buttons
- ✅ **URL Persistence**: Filters now persist in URL query parameters (search, category, brand, minPrice, maxPrice, sort)
- ✅ **Sorting Options**: Price: Low to High, High to Low, Name A-Z, Z-A, Newest First
- ✅ **Price Range**: Min/Max price inputs with validation
- ✅ **Debounced Search**: Search functionality integrated with filters
- ✅ **Shareable URLs**: Filter combinations can be bookmarked and shared

### Admin Dashboard Enhancements
- ✅ **Auto-Redirect**: Admin users are immediately redirected to `/admin` on login
- ✅ **Enhanced User Details**: Admin users table now shows:
  - Full name, email, role
  - Account creation date
  - Last login timestamp (tracked automatically)
  - Total orders count
  - Last order amount
- ✅ **User Profile Modal**: Click any user to view complete profile details in an accessible modal
- ✅ **Responsive Tables**: Admin tables become stacked cards on mobile devices

## Features

- 🛍️ **Product Catalog** - Browse products by category, brand, and price
- 🛒 **Shopping Cart** - Add products to cart with persistent storage
- 💳 **Payment Integration** - Support for Stripe and UPI payments
- 📦 **Order Management** - Track orders with status updates
- 👤 **User Authentication** - Secure login and registration
- 🎛️ **Admin Dashboard** - Comprehensive admin panel with analytics
- 📊 **Analytics & Charts** - Sales, orders, and returns visualization
- 🔐 **Role-Based Access** - Admin and user roles with permissions

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts
- **Authentication**: JWT with httpOnly cookies
- **Payments**: Stripe integration
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB (optional - currently using in-memory stores for demo)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd e-commerce-site-generation
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Create `.env` file (optional for demo):
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

**Admin Email**: sufiyanw026@gmail.com  
**Admin Password**: WasiSufiyan026

After logging in as admin, you'll be automatically redirected to `/admin` dashboard.

## Seed Products

To seed more products (1000 INR products with images):

```bash
npm run seed:more
```

## Admin Dashboard Features

### Dashboard Overview
- **Stats Cards**: Total Revenue, Products, Orders, Users, Returns/Refunds
- **Sales Chart**: 30-day sales and returns visualization
- **Orders Chart**: Distribution by status
- **Recent Orders**: Latest 10 orders with quick actions
- **Status Breakdown**: Order counts by status (pending, processing, shipped, delivered, cancelled)

### Product Management
- View all products with search and filters
- Create new products with images, pricing, and stock
- Edit existing products
- Delete products with confirmation
- Bulk operations support

### Order Management
- View all orders with filters
- Update order status (pending → processing → shipped → delivered → cancelled)
- Process refunds with amount and reason tracking
- View detailed order information including shipping address and payment details

### User Management
- View all registered users with complete details (name, email, role, createdAt, lastLogin, totalOrders, lastOrderAmount)
- View user profile details in modal (click on any user)
- Change user roles (promote/demote admin)
- Delete users (with safety checks)
- Track last login automatically

## API Endpoints

### Admin Endpoints

#### Stats
```bash
GET /api/admin/stats
# Returns dashboard statistics
```

#### Products
```bash
GET /api/admin/products?page=1&limit=20&search=&category=&brand=
POST /api/admin/products
PUT /api/admin/products/:id
DELETE /api/admin/products/:id
```

#### Orders
```bash
GET /api/admin/orders?limit=100&status=&paymentMethod=
PUT /api/admin/orders/:id/status
PUT /api/admin/orders/:id/refund
```

#### Users
```bash
GET /api/admin/users
PUT /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

### Example API Calls

**Get Admin Stats:**
```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" http://localhost:3000/api/admin/stats
```

**Update Order Status:**
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"status":"shipped"}' \
  http://localhost:3000/api/admin/orders/<ORDER_ID>/status
```

**Process Refund:**
```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -d '{"refundAmountINR":499,"reason":"Customer returned"}' \
  http://localhost:3000/api/admin/orders/<ORDER_ID>/refund
```

## Features Implementation Details

### Admin Redirect After Login
- Location: `app/login/page.tsx` (lines 48-49)
- Function: `handleSubmit` - checks `data.user.role === "admin"` and redirects to `/admin`

### Logout Clears Cart
- Location: `components/header.tsx` (lines 43-57)
- Function: `handleLogout` - calls `/api/cart/clear` API and clears localStorage cart
- API: `app/api/cart/clear/route.ts` - clears server-side cart (if implemented)

### Admin Stats Aggregation
- Location: `lib/orders.ts` (lines 212-261)
- Function: `getAdminStats()` - aggregates sales by day, order status counts, revenue, and returns
- Uses MongoDB-style aggregation for salesByDay (last 30 days)

### Charts Implementation
- **Sales Chart**: `components/admin/sales-chart.tsx` - Area chart showing sales and returns over time
- **Orders Chart**: `components/admin/orders-chart.tsx` - Bar chart showing order distribution by status
- Uses Recharts library with responsive design and tooltips

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard pages
│   │   ├── page.tsx        # Dashboard overview
│   │   ├── products/       # Product management
│   │   ├── orders/         # Order management
│   │   └── users/          # User management
│   ├── api/                # API routes
│   │   ├── admin/          # Admin endpoints
│   │   ├── auth/           # Authentication
│   │   └── cart/           # Cart operations
│   ├── products/           # Product pages
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   └── orders/             # User orders
├── components/
│   ├── admin/              # Admin components
│   └── ui/                 # UI components (shadcn)
├── lib/
│   ├── auth.ts            # Authentication logic
│   ├── products.ts        # Product data & helpers
│   ├── orders.ts          # Order data & helpers
│   └── cart-context.tsx   # Cart state management
└── public/                 # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed:more` - Seed additional products

### Environment Variables

Create a `.env` file with:

```env
JWT_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
MONGODB_URI=mongodb://... (optional, currently using in-memory stores)
```

## Security Notes

⚠️ **Important**: 
- No real payment credentials are included in this codebase
- UPI refund/confirm endpoints are marked as DEV-only when simulating
- **Change the seeded admin password before production**
- Use environment variables for all secrets
- Implement proper database instead of in-memory stores for production

## Product Filters & Sorting

### Filter Query Parameters

The products page supports the following URL query parameters:

- `search` - Text search query
- `category` - Filter by category (e.g., "Electronics", "Fashion", "Books")
- `brand` - Filter by brand (e.g., "Samsung", "Penguin", "Nike")
- `minPrice` - Minimum price in INR
- `maxPrice` - Maximum price in INR
- `sort` - Sort order: `price-asc` (Low to High), `price-desc` (High to Low), `name-asc`, `name-desc`, `newest` (default)
- `page` - Page number for pagination

### Example URLs

```
# Filter by category and sort by price (low to high)
/products?category=Electronics&brand=Penguin&sort=price-asc&minPrice=100&maxPrice=5000

# Search with pagination
/products?search=headphones&sort=price-desc&page=2

# Filter by category and show newest first
/products?category=Books&sort=newest
```

### How to Use Filters

1. Navigate to `/products`
2. Open the Filters panel (desktop: sidebar, mobile: hamburger menu)
3. Select filters:
   - Choose sort option (e.g., "Price: Low to High")
   - Select category (e.g., "Electronics")
   - Select brand (e.g., "Penguin")
   - Enter min/max price range
4. Click "Apply Filters" - URL updates and products refresh
5. Click "Clear Filters" to reset all filters

**Note**: Filters persist in URL, so you can bookmark or share filtered product views.

## 🖼️ Product Images

### Update Product Images

Run the script to replace product images with high-quality Google Images:

```bash
npm run fix:images
```

The script will:
- Use MongoDB if `MONGODB_URI` is provided in `.env`
- Otherwise, generate an image mapping JSON file
- Replace placeholder/Picsum images with real product images
- Ensure 3-5 images per product

**Note**: If using in-memory products (no MongoDB), you'll need to manually update `lib/products.ts` with the images from `lib/product_images.json`.

## Testing & Verification

### Quick Start

1. **Setup**:
   ```bash
   npm install
   cp .env.example .env  # Optional: fill MONGODB_URI if using database
   npm run dev
   ```

2. **Verify Blue Theme**:
   - Visit http://localhost:3000
   - Header logo and primary buttons should be blue (#2563eb)
   - Product price badges should be blue
   - All primary actions use blue theme

3. **Test Product Filters**:
   - Go to `/products`
   - Open Filters panel
   - Set Price: Low to High
   - Select Category: Electronics
   - Select Brand: Penguin
   - Enter Min: 100, Max: 5000
   - Click "Apply Filters"
   - ✅ URL should update with query params
   - ✅ Product list should refresh sorted low→high
   - ✅ Only matching products shown
   - Click "Clear Filters" → ✅ All filters reset

4. **Test Responsive Design**:
   - Resize browser or use device emulator
   - Mobile (xs): 1 product per row
   - Small (sm): 2 products per row
   - Medium (md): 3 products per row
   - Large (lg): 4 products per row
   - Filters panel becomes accordion on mobile

5. **Test Admin Login & Redirect**:
   - Go to `/login`
   - Login with admin credentials:
     - Email: `sufiyanw026@gmail.com`
     - Password: `WasiSufiyan026`
   - ✅ Should immediately redirect to `/admin` dashboard (no delay)

6. **Test Admin User Management**:
   - Go to `/admin/users`
   - ✅ Table shows: Name, Email, Role, Created At, Last Login, Orders columns
   - Click on any user row
   - ✅ Modal opens showing full user details:
     - Name, Email, User ID
     - Account Created date/time
     - Last Login timestamp (tracked automatically on login)
     - Total Orders count
     - Last Order Amount
   - ✅ Mobile: Table becomes stacked cards
   - ✅ Can change user role from modal
   - ✅ Email button opens mailto link

7. **Test Amazon-Style UI**:
   - ✅ Header should have Amazon-style dark background (#131921)
   - ✅ Large search bar in header
   - ✅ Product cards should have tall images (3:4 aspect ratio)
   - ✅ Star ratings visible on products
   - ✅ ZippyCart+ badges on products
   - ✅ Filter sidebar with collapsible sections (desktop)
   - ✅ Mobile: filters in sheet/drawer

8. **Test Filters End-to-End**:
   - Go to `/products`
   - Select Category: Electronics
   - Select Brand: Samsung
   - Set Min Price: 10000, Max Price: 100000
   - Select Sort: Price: Low to High
   - Click "Apply Filters"
   - ✅ Products should filter and sort correctly
   - ✅ URL should update with query parameters
   - ✅ Click "Clear Filters" → ✅ All filters reset

9. **Test Product Images**:
   - Run `npm run fix:images` (if using MongoDB)
   - Check product pages → ✅ High-quality images should load
   - Images should match product names/categories

10. **Test Logout & Cart**:
    - Add items to cart
    - Logout → ✅ Cart is cleared (check localStorage)

## License

This project is for demonstration purposes.

## Support

For issues or questions, please refer to the project documentation or create an issue in the repository.

