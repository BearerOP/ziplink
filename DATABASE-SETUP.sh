#!/bin/bash

echo "🗄️  ZipLink Database Setup"
echo "=========================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed"
    echo ""
    echo "Install PostgreSQL:"
    echo "  macOS:   brew install postgresql@15"
    echo "  Ubuntu:  sudo apt-get install postgresql"
    echo ""
    exit 1
fi

echo "✅ PostgreSQL found"
echo ""

# Check if database exists
if psql -lqt | cut -d \| -f 1 | grep -qw ziplink; then
    echo "ℹ️  Database 'ziplink' already exists"
else
    # Create database
    echo "📦 Creating database 'ziplink'..."
    createdb ziplink && echo "✅ Database created successfully" || {
        echo "❌ Failed to create database"
        echo "   You may need to configure PostgreSQL first"
        exit 1
    }
fi

# Check for .env file
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  No .env file found"
    echo "   Creating .env from env.example..."
    cp env.example .env
    echo "✅ .env file created"
    echo "   Please update DATABASE_URL in .env with your credentials"
    echo ""
fi

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Push schema to database
echo ""
echo "📊 Creating database tables..."
npx prisma db push --accept-data-loss

# Verify database
echo ""
echo "🔍 Verifying database setup..."
npm run db:seed

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 What was created:"
echo "   • Database tables (User, ZipLink, ZipClaim, ZipLinkAnalytics)"
echo "   • All tables are empty and ready for use"
echo ""
echo "🚀 Next steps:"
echo "   1. Verify DATABASE_URL in .env file"
echo "   2. Run 'npm run dev' to start the app"
echo "   3. Visit http://localhost:3000/admin to see the dashboard"
echo "   4. Visit http://localhost:3000/create to create your first ZipLink"
echo ""
echo "💡 Useful commands:"
echo "   npm run db:push   - Push schema changes to database"
echo "   npm run db:seed   - Re-seed the database"
echo "   npm run db:studio - Open Prisma Studio (database GUI)"
echo "   npm run db:reset  - Reset and re-seed database"
echo ""
