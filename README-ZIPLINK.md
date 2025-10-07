# 💸 ZipLink - Send SOL via Links

> A complete link-based wallet system for Solana - Send SOL to anyone via shareable links, no wallet required!

---

## 🚀 Quick Start

```bash
# 1. Setup database
./DATABASE-SETUP.sh

# 2. Run the app
npm run dev

# 3. Create your first ZipLink
# Visit: http://localhost:3000/create
```

---

## ✨ Features

- 🔗 **Shareable Links** - Send SOL via simple URLs
- 📱 **QR Codes** - Share via QR for mobile claiming
- 🔐 **Google OAuth** - Create wallets with Google login
- 💼 **Multi-Wallet** - Phantom, Solflare, Backpack, MetaMask
- 📊 **Admin Dashboard** - Track all ZipLinks and analytics
- 📈 **Analytics** - View statistics and export CSV
- ⏰ **Link Expiration** - Set expiry times
- 🔒 **Encrypted Storage** - AES-256-GCM encryption
- 🎯 **Claim Tracking** - Full audit trail

---

## 📋 Database Setup Commands

```bash
# Setup everything automatically
./DATABASE-SETUP.sh

# Or manually:
npx prisma generate     # Generate Prisma Client
npx prisma db push      # Create tables
npm run db:seed         # Verify setup

# Useful commands:
npm run db:studio       # Open database GUI
npm run db:reset        # Reset database
```

---

## 🗂️ Database Tables Created

1. **User** - User accounts with Google OAuth
2. **ZipLink** - ZipLink records with encrypted keys
3. **ZipClaim** - Claim events and transaction history
4. **ZipLinkAnalytics** - Daily statistics

All tables start empty and ready for use.

---

## 🎯 User Flows

### Create ZipLink
```
/create → Enter amount & message → Get link + QR code → Share!
```

### Claim ZipLink
```
/claim/[id] → Connect wallet → Click claim → SOL received!
```

### Admin Dashboard
```
/admin → View all links → See analytics → Export CSV
```

---

## 📡 API Endpoints

**ZipLink APIs:**
- `POST /api/ziplink/create` - Create ZipLink
- `POST /api/ziplink/claim` - Claim ZipLink
- `GET /api/ziplink/[linkId]` - Get details
- `DELETE /api/ziplink/[linkId]` - Cancel link

**Admin APIs:**
- `GET /api/admin/ziplinks` - List all (paginated)
- `GET /api/admin/analytics` - Get statistics

**Wallet APIs:**
- `POST /api/wallet/google/connect` - Google wallet
- `POST /api/wallet/sign-transaction` - Sign tx
- `POST /api/wallet/sign-message` - Sign message
- `POST /api/wallet/disconnect` - Logout

---

## 🔧 Environment Variables

Required in `.env`:

```env
# Database (Required)
DATABASE_URL="postgresql://..."

# Google OAuth (Optional)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...

# App Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Secrets (Change in production!)
WALLET_SECRET=your-secret-here
SESSION_SECRET=your-secret-here

# Solana
SOLANA_RPC_ENDPOINT=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
```

---

## 📚 Documentation

- `FINAL-SETUP-GUIDE.md` - Complete setup instructions
- `ZIPLINK-SETUP.md` - Detailed system guide
- `SETUP-GOOGLE-OAUTH.md` - Google OAuth setup
- `COMPLETE-SYSTEM-SUMMARY.md` - Architecture overview
- `DATABASE-SETUP.sh` - Auto-setup script

---

## 🏗️ Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Blockchain:** Solana Web3.js (Devnet)
- **Auth:** Google OAuth (`@react-oauth/google`)
- **UI:** shadcn/ui components
- **QR:** qrcode.react

---

## 🔐 Security

- ✅ Encrypted private keys (AES-256-GCM)
- ✅ Secure session management
- ✅ Input validation
- ✅ SQL injection protection (Prisma)
- ✅ Environment variable secrets
- ✅ HTTPS ready

---

## 📦 What's Included

```
✅ 9 Backend API routes
✅ 4 Frontend pages
✅ 4 Database tables
✅ QR code generation
✅ Admin dashboard
✅ Analytics system
✅ Google OAuth integration
✅ Multi-wallet support
✅ Complete documentation
```

---

## 🚀 Deploy to Production

```bash
# 1. Setup production database (Railway/Supabase)
# 2. Update .env with production DATABASE_URL
# 3. Change WALLET_SECRET and SESSION_SECRET
# 4. Deploy to Vercel
vercel

# 5. Run migrations on production DB
npx prisma migrate deploy
```

---

## 💡 Example Use Cases

- 💰 **Tip Jars** - Accept tips via links
- 🎁 **Gifts** - Send birthday/holiday gifts
- 💼 **Payments** - Simple payment links
- 🎫 **Event Tickets** - Send ticket funds
- 👥 **Team Payments** - Distribute payments easily
- 📢 **Marketing** - Promotional airdrops

---

## ✅ Complete System Ready!

Everything is built and working:

✅ Create ZipLinks  
✅ Share via QR codes  
✅ Claim to any wallet  
✅ Google wallet support  
✅ Admin dashboard  
✅ Full analytics  
✅ Database persistence  

**Start building:** `npm run dev`

---

Made with ❤️ for the Solana ecosystem

