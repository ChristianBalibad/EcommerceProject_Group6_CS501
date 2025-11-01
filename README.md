# E-commerce Project - Group 6 CS501

A modern e-commerce web application built with Next.js, TypeScript, Tailwind CSS, and SQLite.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma ORM)
- **Authentication**: Custom JWT-less session (localStorage)
- **State Management**: React Context API

## Features

- User authentication (Admin & Customer roles)
- Product catalog with filtering
- Shopping cart functionality
- Checkout process (mockup - no order saving)
- Admin panel for product management
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcommerceProject_Group6_CS501/my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   
   The project uses SQLite, which requires no additional installation. Run the following commands:

   ```bash
   # Create database and tables
   npx prisma migrate dev --name init

   # Seed demo data (users & products)
   npx prisma db seed
   ```

   This will create:
   - SQLite database file (`dev.db`)
   - 2 demo users
   - 6 demo products

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `admin`
- **Access**: Full admin panel for product management

### Customer Account
- **Username**: `customer`
- **Password**: `customer`
- **Access**: Shopping features (browse, cart, checkout)

## Project Structure

```
my-app/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── products/        # Product CRUD endpoints
│   │   ├── orders/          # Order management endpoints
│   │   └── admin/           # Admin-specific endpoints
│   ├── account/             # Login/account page
│   ├── admin/               # Admin dashboard
│   ├── products/            # Product listing & detail pages
│   ├── cart/                # Shopping cart page
│   ├── checkout/            # Checkout page
│   └── layout.tsx           # Root layout
├── components/              # React components
│   ├── layout/              # Layout components (Navbar, Footer, etc.)
│   ├── product/             # Product-related components
│   ├── cart/                # Cart components
│   └── ui/                  # Reusable UI components
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   ├── CartContext.tsx      # Shopping cart state
│   └── ToastContext.tsx     # Toast notifications
├── lib/                     # Utility libraries
│   └── prisma.ts            # Prisma client instance
├── prisma/                  # Database configuration
│   ├── schema.prisma        # Database schema
│   ├── seed.ts              # Seed data script
│   └── migrations/          # Database migrations
└── public/                  # Static assets
    └── images/              # Product images & assets
```

## API Routes

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with optional filters)
- `GET /api/products/[slug]` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/[slug]` - Update product (admin only)
- `DELETE /api/products/[slug]` - Delete product (admin only)

## Database Schema

### Users
- id, username, email, password (hashed), role, timestamps

### Products
- id, name, slug, category, price, originalPrice, description, imageUrl, stock, sizes, colors, timestamps

**Note:** Orders are not saved to the database. The checkout process is a mockup that clears the cart and shows a success message.

## Development

### Adding New Products

1. Login as admin (`admin` / `admin`)
2. Navigate to Admin Dashboard
3. Fill in product details
4. Submit to add to database

### Viewing Database

Use Prisma Studio to view/edit database:
```bash
npx prisma studio
```

This opens a web interface at [http://localhost:5555](http://localhost:5555)

## Troubleshooting

### Database Issues

If you encounter database errors:
```bash
# Reset database
npx prisma migrate reset

# This will:
# 1. Drop database
# 2. Recreate database
# 3. Run migrations
# 4. Run seed data
```

### Port Already in Use

If port 3000 is already in use:
```bash
# Run on different port
npm run dev -- -p 3001
```

## Building for Production

```bash
npm run build
npm run start
```

## Notes

- All passwords are hashed using bcrypt
- Cart data persists in localStorage
- Orders are NOT saved (mockup only - shows success message)
- Database file (`dev.db`) can be committed to Git for easy setup
- No external database server required (SQLite)

## Group Members

Group 6 - CS501

---

For questions or issues, please contact the development team.
