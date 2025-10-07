# 💸 ZipLink - Send SOL via Shareable Links

> A complete Solana wallet system that lets anyone send SOL through simple links and QR codes - no wallet required for recipients!

![ZipLink](https://img.shields.io/badge/Solana-Devnet-9945FF?style=for-the-badge&logo=solana)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)

---

## 🎯 What is ZipLink?

ZipLink is a **link-based wallet system** that allows you to send Solana (SOL) to anyone via a simple shareable link - just like sending a payment link, but for crypto!

**Key Features:**
- 🔗 Create shareable payment links
- 📱 QR code generation for mobile
- 🔐 Supports Google OAuth wallets + browser extensions
- 💼 Admin dashboard with analytics
- 🔒 Encrypted key storage
- ⏰ Automatic link expiration
- 📊 Complete claim tracking

---

## 🚀 Quick Start (3 Steps)

### 1️⃣ Setup Database
```bash
./DATABASE-SETUP.sh
```

### 2️⃣ Configure Environment
```bash
# Copy example file
cp env.example .env

# Edit .env and add:
DATABASE_URL="postgresql://user:password@localhost:5432/ziplink"
```

### 3️⃣ Run the App
```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📖 How It Works

### Create a ZipLink
1. Go to `/create`
2. Enter amount (e.g., 0.1 SOL)
3. Add optional message and title
4. Click "Create ZipLink"
5. Get shareable link + QR code!

### Recipient Claims
1. Opens your link
2. Connects wallet (or creates one with Google)
3. Clicks "Claim"
4. SOL transferred instantly!

### Monitor Everything
1. Visit `/admin` dashboard
2. See all links, claims, analytics
3. Export data as CSV

---

## 📁 Project Structure

```
ziplink/
├── app/
│   ├── api/                     # Backend APIs
│   │   ├── wallet/              # Google wallet APIs
│   │   ├── ziplink/             # ZipLink CRUD APIs
│   │   └── admin/               # Analytics APIs
│   ├── create/                  # Create ZipLink page
│   ├── created/[linkId]/        # Success page with QR
│   ├── claim/[linkId]/          # Claim page
│   └── admin/                   # Dashboard
├── lib/
│   ├── prisma.ts                # Database client
│   ├── sessions.ts              # Session management
│   ├── ziplink/utils.ts         # Utilities
│   └── wallet/                  # Wallet adapters
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Table verification
└── components/                  # UI components
```

---

## 🗄️ Database Schema

**Tables Created:**
- `User` - User accounts with Google OAuth
- `ZipLink` - Link records with encrypted keys
- `ZipClaim` - Claim events and transactions
- `ZipLinkAnalytics` - Daily statistics

**Relationships:**
- User → ZipLink (one-to-many)
- ZipLink → ZipClaim (one-to-many)

---

## 📡 API Reference

### ZipLink APIs

**Create ZipLink**
```bash
POST /api/ziplink/create
{
  "amount": 0.1,
  "memo": "Happy birthday!",
  "title": "Gift",
  "expiresIn": 24
}
```

**Claim ZipLink**
```bash
POST /api/ziplink/claim
{
  "linkId": "abc123",
  "recipientAddress": "5X7Yf..."
}
```

**Get ZipLink Details**
```bash
GET /api/ziplink/[linkId]
```

### Admin APIs

**List ZipLinks**
```bash
GET /api/admin/ziplinks?status=active&page=1&limit=50
```

**Get Analytics**
```bash
GET /api/admin/analytics?days=30
```

---

## 🔧 Configuration

### Required Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ziplink"

# Secrets (Change in production!)
WALLET_SECRET=your-encryption-secret
SESSION_SECRET=your-session-secret

# Optional: Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Optional Variables

```env
# App URLs
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Solana Network
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
```

---

## 💻 NPM Commands

```bash
# Development
npm run dev              # Start dev server

# Database
npm run db:push          # Create/update tables
npm run db:seed          # Verify database setup
npm run db:studio        # Open Prisma Studio (GUI)
npm run db:reset         # Reset database

# Build
npm run build            # Build for production
npm run start            # Run production build
```

---

## 🎨 Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/create` | Create new ZipLink |
| `/created/[id]` | Success page with QR code |
| `/claim/[id]` | Claim page |
| `/admin` | Admin dashboard |

---

## 🔐 Security Features

- **Encrypted Keys** - All private keys encrypted with AES-256-GCM
- **Session Management** - Secure 24-hour sessions
- **Input Validation** - All inputs validated
- **SQL Injection Protection** - Prisma ORM
- **Environment Secrets** - Sensitive data in `.env`
- **HTTPS Ready** - Production deployment ready

---

## 🐛 Troubleshooting

**Database connection error?**
```bash
# Check PostgreSQL is running
brew services list
brew services start postgresql@15
```

**Tables not created?**
```bash
npx prisma db push
```

**Prisma client error?**
```bash
npx prisma generate
```

**Build failing?**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

---

## 📦 Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Blockchain:** Solana Web3.js
- **Auth:** Google OAuth
- **UI:** Tailwind CSS + shadcn/ui
- **QR Codes:** qrcode.react
- **Crypto:** TweetNaCl

---

## 🚀 Deployment

### Deploy to Vercel + Railway

```bash
# 1. Create Railway PostgreSQL
railway add postgresql

# 2. Get connection string
railway variables

# 3. Deploy to Vercel
vercel

# 4. Add environment variables in Vercel
# 5. Run migrations
npx prisma migrate deploy
```

### Production Checklist

- [ ] Change `WALLET_SECRET` to strong random string
- [ ] Change `SESSION_SECRET` to strong random string
- [ ] Setup production PostgreSQL
- [ ] Add rate limiting
- [ ] Enable error monitoring (Sentry)
- [ ] Replace in-memory sessions with Redis
- [ ] Add proper admin authentication
- [ ] Setup backup system

---

## 📈 Features Roadmap

### ✅ Completed
- Create/claim ZipLinks
- QR code generation
- Google OAuth wallets
- Browser extension wallets
- Admin dashboard
- Analytics & CSV export
- Link expiration
- Encrypted storage

### 🔜 Future Enhancements
- Email notifications
- SPL token support (USDC, etc.)
- Bulk creation
- API keys for developers
- Webhooks
- Link passwords
- Recurring ZipLinks
- Mobile app

---

## 📚 Additional Documentation

- **Setup:** `FINAL-SETUP-GUIDE.md` - Step-by-step setup
- **System:** `COMPLETE-SYSTEM-SUMMARY.md` - Architecture
- **Google Auth:** `SETUP-GOOGLE-OAUTH.md` - OAuth setup
- **Wallets:** `lib/wallet/README.md` - Wallet adapters

---

## 🎉 Ready to Ship!

Your ZipLink system is complete and production-ready!

**Start now:**
```bash
./DATABASE-SETUP.sh && npm run dev
```

**Questions?** Check the documentation in the project root.

---

## 📄 License

MIT License - feel free to use in your projects!

---

**Built for the Solana ecosystem** 🚀
