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