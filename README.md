# Stealth Anti-Cheat Platform

Modern anti-cheat software platform built with Next.js 14, React, TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

## Features

- Marketing website with cyberpunk/cybersecurity aesthetic
- User authentication with NextAuth v5 and bcrypt password hashing
- Two-factor authentication (2FA) with TOTP
- License management and activation with HWID binding
- API key generation and management with secure hashing
- Team/organization support with seat management
- Activity logging
- Downloads page with gated access
- Stripe payment integration
- PostgreSQL database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth v5
- **Password Hashing**: bcryptjs
- **2FA**: speakeasy + qrcode
- **Payments**: Stripe
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Toast**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account (for payment processing)

### Installation

1. Clone the repository

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in the values:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/stealth"

# NextAuth
NEXTAUTH_SECRET="your-32-character-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_key_here"
STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_key_here"
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Push database schema:

```bash
npx prisma db push
```

Or run migrations:

```bash
npx prisma migrate dev --name init
```

6. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Database Schema

The application uses the following main models:

- **User**: User accounts with email, username, password hash, 2FA settings
- **License**: License keys with tier (usermode/kernel), activation limits, team seats
- **Activation**: Device activations with HWID, device name, IP address
- **ApiKey**: API keys with secure hashing, environment (production/sandbox)
- **TeamMember**: Team member invitations and sub-licenses
- **Activity**: Activity log for user actions

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth handlers (login, logout, session)
- `POST /api/auth/2fa/setup` - Generate 2FA secret and QR code
- `POST /api/auth/2fa/verify` - Verify 2FA token
- `POST /api/auth/2fa/disable` - Disable 2FA (requires password)

### Licenses
- `GET /api/licenses` - Get user's licenses
- `POST /api/licenses/activate` - Activate license on device (HWID binding)
- `POST /api/licenses/deactivate` - Deactivate device

### API Keys
- `GET /api/api-keys` - Get user's API keys
- `POST /api/api-keys` - Generate new API key (returned once)
- `POST /api/api-keys/revoke` - Revoke API key

### Team Management
- `GET /api/team` - Get team members
- `POST /api/team` - Invite team member
- `POST /api/team/remove` - Remove team member

### Activity
- `GET /api/activity` - Get user's activity feed

### Checkout
- `POST /api/checkout/create-session` - Create Stripe checkout session
- `POST /api/webhooks/stripe` - Handle Stripe webhook events (license provisioning)

## Testing

Run unit tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

Run E2E tests:

```bash
npm run test:e2e
```

## Project Structure

```
src/
├── app/              # Next.js app router pages and API routes
│   ├── api/         # API route handlers
│   │   ├── auth/    # Authentication endpoints
│   │   ├── licenses/ # License management
│   │   ├── api-keys/ # API key management
│   │   ├── team/    # Team management
│   │   ├── activity/ # Activity feed
│   │   ├── checkout/ # Stripe checkout
│   │   └── webhooks/ # Stripe webhooks
│   └── (pages)/     # Next.js pages
├── components/       # React components
│   ├── ui/          # Primitive UI components
│   ├── layout/      # Layout components
│   ├── marketing/   # Marketing page sections
│   ├── dashboard/   # Dashboard components
│   ├── auth/        # Auth components
│   └── effects/     # Visual effects
├── contexts/        # React contexts (migrating to server-side)
├── hooks/           # Custom hooks
├── lib/             # Utilities and helpers
│   ├── prisma.ts   # Prisma client singleton
│   ├── auth.ts     # NextAuth configuration
│   ├── crypto.ts   # Crypto utilities (key generation, hashing)
│   ├── validators.ts # Zod schemas
│   └── utils.ts    # General utilities
├── types/           # TypeScript types
└── prisma/          # Prisma schema
    └── schema.prisma # Database schema
```

## Security Considerations

- **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
- **2FA**: Two-factor authentication using TOTP (Time-based One-Time Password)
- **API Keys**: API keys are hashed using SHA-256 before storage; full keys are never stored
- **HWID Binding**: License activations are bound to hardware IDs to prevent sharing
- **Session Management**: JWT-based sessions with 30-day expiration
- **CSRF Protection**: Built-in NextAuth CSRF protection
- **Rate Limiting**: Consider adding rate limiting for production (not included in this version)

## Stripe Integration

### Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Set up webhook endpoint at `/api/webhooks/stripe`
4. Configure webhook to listen for `checkout.session.completed` events

### Testing Payments

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

### Webhook Testing

Use Stripe CLI for local webhook testing:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Production Deployment

### Environment Variables

Ensure all production environment variables are set:

- Generate a secure `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Update `NEXTAUTH_URL` to your production domain
- Use production Stripe keys
- Set up a production PostgreSQL database

### Database Migrations

Run migrations in production:

```bash
npx prisma migrate deploy
```

### Prisma Generate

Ensure Prisma client is generated in your build process:

```bash
npx prisma generate
```

### Vercel Deployment

The app is optimized for Vercel deployment:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy

### Manual Deployment

Build the app:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Development Notes

- The frontend was initially built with mock data (see `src/lib/mock-data.ts`)
- Backend APIs now provide real data from PostgreSQL
- Consider migrating frontend contexts to server components and server actions
- Add rate limiting middleware for production
- Set up email service for team invitations and notifications
- Add Redis for session storage and caching in high-traffic scenarios

## License

Proprietary
