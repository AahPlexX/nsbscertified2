<<<<<<< HEAD

=======
<<<<<<< HEAD
## GitAuto resources

Here are GitAuto resources.

- [GitAuto homepage](https://gitauto.ai?utm_source=github&utm_medium=referral)
- [GitAuto demo](https://www.youtube.com/watch?v=wnIi73WR1kE)
- [GitAuto use cases](https://gitauto.ai/blog?utm_source=github&utm_medium=referral)
- [GitAuto GitHub issues](https://github.com/gitautoai/gitauto/issues)
- [GitAuto LinkedIn](https://www.linkedin.com/company/gitauto/)
- [GitAuto Twitter](https://x.com/gitautoai)
- [GitAuto YouTube](https://youtube.com/@gitauto)
=======

# National Society of Business Sciences (NSBS)

## Overview
NSBS is a professional online learning platform offering text-based courses in business sciences. The platform provides a distraction-free learning environment with comprehensive course materials and industry-recognized certifications.

## Technology Stack
- Next.js (v15.1.7) - React framework with App Router
- React (v19.0.0) - UI library
- TypeScript (v5.7.2) - Type system
- Tailwind CSS (v4.0.6) - Styling
- Prisma - ORM with PostgreSQL (Supabase)
- authjs v5 - Authentication
- Zod - Schema validation
- Zustand - State management
- Stripe - Payment processing

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.local.example` and configure:
- Database URLs (DATABASE_URL, DIRECT_URL)
- Stripe secret key
- NextAuth secret and URL
- Optional: Google OAuth credentials

### 3. Database Setup
```bash
# Run Prisma migrations
npx prisma migrate dev --name "init"

# Generate Prisma Client
npx prisma generate

# Seed database (if needed)
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run e2e-test
```

## Architecture

### Role-Based Access Control (RBAC)
- Implemented using authjs v5 middleware
- Two roles: ADMIN and STUDENT
- Protected routes and API endpoints

### Exam System
- 100 multiple-choice questions
- Pass threshold: 80/100
- Two attempt vouchers per course
- Additional vouchers available for purchase

### Certificate Generation
- PDF generation with security measures
- Digital watermarking
- Unique certificate IDs

### Payment Integration
- Stripe checkout integration
- Dynamic payment links per course
- Secure payment processing

## Contributing
1. Follow TypeScript strict mode guidelines
2. Ensure ESLint and Prettier rules pass
3. Write tests for new features
4. Submit PRs against the main branch

## Performance Optimization
- SSR/hydration strategies implemented
- Data caching via SWR
- Connection pooling for database
- Optimized asset delivery

## Error Handling & Logging
- Global error boundaries
- Structured logging
- Fallback UIs for component failures
- API error standardization
>>>>>>> aa8feee (Assistant checkpoint: Complete project documentation and environment setup)
>>>>>>> ff23285 (Assistant checkpoint: Complete project documentation and environment setup)
