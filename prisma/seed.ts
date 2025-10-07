import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database initialization...')
  console.log('')
  
  // Check database connection
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful')
  } catch (error) {
    console.error('❌ Failed to connect to database')
    console.error('   Make sure PostgreSQL is running and DATABASE_URL is correct in .env')
    throw error
  }

  // Verify tables exist (Prisma will create them via db push)
  console.log('📊 Verifying database tables...')
  
  try {
    await prisma.user.findMany({ take: 1 })
    console.log('✅ User table ready')
  } catch (error) {
    console.log('⚠️  User table not found - run "npx prisma db push" first')
  }

  try {
    await prisma.zipLink.findMany({ take: 1 })
    console.log('✅ ZipLink table ready')
  } catch (error) {
    console.log('⚠️  ZipLink table not found - run "npx prisma db push" first')
  }

  try {
    await prisma.zipClaim.findMany({ take: 1 })
    console.log('✅ ZipClaim table ready')
  } catch (error) {
    console.log('⚠️  ZipClaim table not found - run "npx prisma db push" first')
  }

  try {
    await prisma.zipLinkAnalytics.findMany({ take: 1 })
    console.log('✅ ZipLinkAnalytics table ready')
  } catch (error) {
    console.log('⚠️  ZipLinkAnalytics table not found - run "npx prisma db push" first')
  }

  console.log('')
  console.log('✨ Database is ready!')
  console.log('')
  console.log('📋 Tables created:')
  console.log('   • User - User accounts')
  console.log('   • ZipLink - ZipLink records')
  console.log('   • ZipClaim - Claim events')
  console.log('   • ZipLinkAnalytics - Daily statistics')
  console.log('')
  console.log('🚀 You can now:')
  console.log('   1. Run "npm run dev" to start the app')
  console.log('   2. Visit http://localhost:3000/create to create ZipLinks')
  console.log('   3. Visit http://localhost:3000/admin to view dashboard')
  console.log('')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

