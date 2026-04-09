# Demo Items File

This directory contains optional demo data files for the Pohela Boishak application.

## Files

### `demo-items.sql`
Contains 27 sample food items, beverages, and stall activity offerings.

**What's included:**
- **Food Items** (13): Cakes, sweets, snacks, pastries - WITH IMAGES ✨
- **Beverages** (4): Cold coffee, drinks, faluda, lemonades - WITH IMAGES ✨
- **Combo** (1): Special bundled offering - WITH IMAGES ✨
- **Other Items** (9): Lottery, jewelry, crafts, art, pickles, keyrings, masks, alpona - WITH IMAGES ✨

## Quick Load Instructions

### Method 1: Using Terminal
```bash
cd server
psql -U postgres -d pohela_boishakh -f demo-items.sql
```

### Method 2: Using the Load Script (macOS/Linux)
```bash
cd server
chmod +x load-demo-items.sh
./load-demo-items.sh
```

### Method 3: Direct SQL (from psql prompt)
```bash
psql -U postgres -d pohela_boishakh
```
Then inside psql:
```sql
\i demo-items.sql
```

## What You Get

✅ **All items have:**
- Item names (in Bengali)
- Descriptions (in Bengali)
- Prices (টাকা)
- Pictures (from Unsplash - free images)
- Categories (খাবার, জুস, কম্বো, অন্যান্য)
- Sort order (displays in proper sequence)

## Example Items

### Food Category 🍰
- কেক (Cake) - ৮০৳ with image
- ফ্লেভার্ড রসগোল্লা (Rassgolla) - ৫০৳ with image
- টিরামিসু (Tiramisu) - ১২০৳ with image

### Juice Category 🥤
- কোল্ড কফি (Cold Coffee) - ৮০৳ with image
- ফালুদা (Faluda) - ১০০৳ with image

### Combo Category 🎁
- বৈশাখী কম্বো প্লেট (Boishakhi Combo) - ১২০৳ with image

### Other Category 🎨
- হ্যান্ডমেড জুয়েলারী (Handmade Jewelry) - ১৫০৳ with image
- ক্যানভাস (Canvas Art) - ২০০৳ with image

## After Loading

1. **Start your server:**
   ```bash
   npm start
   ```

2. **Visit your app:**
   - Go to http://localhost:3000 (or your deployed URL)
   - See all items with pictures displayed in the menu! 📸

3. **Manage items:**
   - Visit admin dashboard: http://localhost:3000/admin/login
   - Edit prices, descriptions, or images
   - Delete items you don't need
   - Add new items with pictures

4. **Customize:**
   - All items can be edited after loading
   - Change pictures, prices, descriptions anytime
   - Items are fully responsive on mobile 📱

## Database Fields

Each item in the database has:
```
- id (auto-generated)
- name (Bengali)
- description (Bengali)
- price (numeric)
- category (খাবার, জুস, কম্বো, অন্যান্য)
- image_url (link to picture)
- sort_order (display sequence)
- combo_items (for combo meals)
- created_at (timestamp)
- in_stock (default: true)
```

## Note

- Demo items are **completely optional** ✨
- You can start with an empty database and add items through the admin panel
- After loading, delete any items you don't need from admin dashboard
- Each item can be edited, updated, or deleted individually
- Images are from Unsplash (free to use)

## Why Separate?

Demo items are kept separate so you can:
1. Start fresh with just the admin user
2. Gradually add your own items through the admin interface
3. Optionally load samples if you want a starting point
4. **Now with pictures included!** - No need to add images manually

This gives maximum flexibility for your specific event needs.

---

**Updated:** Demo items now include high-quality images from Unsplash for instant visual appeal! 🎉

