# Trackify - Track Your Expenses Smarter

A modern, production-ready SaaS expense tracker built with Next.js, MongoDB, and TailwindCSS.

## Features

- **Authentication** - Secure JWT-based auth with NextAuth.js
- **Dashboard** - Overview of income, expenses, and balance
- **Transactions** - Full CRUD with filtering and categorization
- **Analytics** - Interactive charts (Pie, Line, Bar) powered by Recharts
- **Budget Tracking** - Set monthly budgets with overspend alerts
- **CSV Export** - Download your transaction data
- **Dark Mode** - Full dark mode support
- **Responsive** - Works on mobile, tablet, and desktop

## Tech Stack

- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: NextAuth.js (JWT)
- **Charts**: Recharts
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Deployment on Vercel

1. Push the project to a GitHub repository
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `MONGODB_URI`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your Vercel deployment URL)
4. Deploy

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth API
│   │   ├── signup/              # User registration
│   │   ├── transactions/        # Transaction CRUD
│   │   ├── settings/            # Profile & password
│   │   └── budget/              # Budget management
│   ├── dashboard/               # Dashboard page
│   ├── transactions/            # Transactions page
│   ├── analytics/               # Analytics page
│   ├── settings/                # Settings page
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   └── page.tsx                 # Landing page
├── components/
│   ├── charts/                  # Recharts components
│   ├── layout/                  # Layout components
│   └── ui/                      # UI components
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   └── mongodb.ts               # Database connection
├── models/
│   ├── User.ts                  # User model
│   └── Transaction.ts           # Transaction model
└── types/
    └── index.ts                 # TypeScript types
```
