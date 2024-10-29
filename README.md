# Portfolio Tracker

A Next.js application for tracking venture capital investments and portfolio companies.

## Features

- 📊 Dashboard with portfolio overview
- 🏢 Company management
- 💰 Investment tracking
- 📈 Portfolio analytics and reports
- 🔐 Authentication
- 🌐 Internationalization
- 🎨 Responsive design with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Containerization:** Docker
- **API:** REST with built-in Next.js API routes
- **Type Safety:** TypeScript
- **Form Validation:** Zod
- **Internationalization:** next-intl

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone git@github.com:mb-woys/investment-deck.git
   cd portfolio-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://admin:password@localhost:5432/portfolio?schema=public"
   ```

4. **Start the database**
   ```bash
   npm run docker:up
   ```

5. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Push database schema
   npm run prisma:push

   # Seed the database
   npm run prisma:seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000/en`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:push` - Push database schema
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed the database

## Database Schema

The application uses two main models:

- **Company**: Represents portfolio companies
- **Investment**: Tracks investments in companies

For detailed schema information, see `prisma/schema.prisma`

## Authentication

WIP: The application will be using NextAuth.js for authentication. 
Right now it's not implemented

Demo credentials:
- Email: admin@contrary.com
- Password: password123
