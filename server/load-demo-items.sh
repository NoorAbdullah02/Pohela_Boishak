#!/bin/bash

# Load Demo Items Script for Pohela Boishak
# This script loads 27 demo food items with pictures, names, descriptions, and prices

echo "📦 Loading demo items into the database..."
echo ""

# Check if PostgreSQL is running
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed or not in PATH"
    exit 1
fi

# Load demo items
psql -U postgres -d pohela_boishakh -f demo-items.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Demo items loaded successfully!"
    echo ""
    echo "📋 Items added:"
    echo "   • 13 Food items (desserts, sweets, snacks)"
    echo "   • 4 Juice/beverage items"
    echo "   • 1 Combo package"
    echo "   • 9 Other items (activities, crafts)"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Start the server: npm start"
    echo "   2. Visit your app and see items in the menu"
    echo "   3. Edit prices or descriptions in admin dashboard"
    echo "   4. Delete items you don't need from admin panel"
    echo ""
else
    echo "❌ Failed to load demo items."
    echo "Make sure:"
    echo "   • PostgreSQL is running"
    echo "   • Database 'pohela_boishakh' exists"
    echo "   • You have permission to access the database"
    exit 1
fi
