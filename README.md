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
- Checkout process
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

   # If it doesn't work (wala kay makita na successfully seeded), run:
   npx tsx prisma/seed.js
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

# If you can't see any data, run:
npx tsx prisma/seed.ts
```

### Port Already in Use

If port 3000 is already in use:
```bash
# Run on different port
npm run dev -- -p 3001

```

###Group Members

Group 6 - CS501
- Balibad, Christian (Developer)
- Baylon, Ivan Keith (Designer)
- Cabaltera, Kathrina (Quality Assurance)
- Nellas, Zessuah Ray (Project Planner)

---

For questions or issues, please dm/pm the development team.