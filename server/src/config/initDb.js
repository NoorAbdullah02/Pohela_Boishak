import pg from 'pg';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const { Client, Pool } = pg;

export const initDatabase = async () => {
  const rootClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  try {
    await rootClient.connect();
    const dbCheck = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = 'pohela_boishakh'"
    );
    if (dbCheck.rows.length === 0) {
      await rootClient.query('CREATE DATABASE pohela_boishakh');
      console.log('✅ ডাটাবেজ "pohela_boishakh" তৈরি হয়েছে');
    }
  } catch (err) {
    console.error('ডাটাবেজ তৈরি করতে সমস্যা:', err.message);
  } finally {
    await rootClient.end();
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE item_category AS ENUM ('খাবার', 'জুস', 'কম্বো', 'অন্যান্য');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_method AS ENUM ('ক্যাশ', 'অনলাইন');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('অপেক্ষমান', 'নিশ্চিত', 'সম্পন্ন', 'বাতিল');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        current_challenge VARCHAR(512),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS food_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category item_category NOT NULL,
        image_url TEXT,
        combo_items TEXT[],
        in_stock BOOLEAN DEFAULT TRUE,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

      await pool.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_number SERIAL,
          customer_name VARCHAR(255) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50),
          items JSONB NOT NULL,
          total_amount DECIMAL(10, 2) NOT NULL,
          payment_method payment_method NOT NULL,
          status order_status DEFAULT 'অপেক্ষমান',
          transaction_id VARCHAR(255),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Ensure customer_phone exists if table was already created
      await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50)`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token_hash VARCHAR(255) NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        revoked BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS webauthn_credentials (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        credential_id TEXT UNIQUE NOT NULL,
        public_key TEXT NOT NULL,
        counter BIGINT DEFAULT 0,
        device_type VARCHAR(50),
        backed_up BOOLEAN DEFAULT FALSE,
        transports TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const createIndexSafe = async (name, sql) => {
      try { await pool.query(sql); } catch (e) {}
    };

    await createIndexSafe('idx_food_category', 'CREATE INDEX IF NOT EXISTS idx_food_items_category ON food_items(category)');
    await createIndexSafe('idx_food_stock', 'CREATE INDEX IF NOT EXISTS idx_food_items_in_stock ON food_items(in_stock)');
    await createIndexSafe('idx_orders_status', 'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)');
    await createIndexSafe('idx_orders_created', 'CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)');
    await createIndexSafe('idx_rt_user', 'CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id)');
    await createIndexSafe('idx_wac_user', 'CREATE INDEX IF NOT EXISTS idx_webauthn_credentials_user_id ON webauthn_credentials(user_id)');

    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql'
    `);

    const createTriggerSafe = async (name, table) => {
      try {
        await pool.query(`
          CREATE TRIGGER ${name}
          BEFORE UPDATE ON ${table}
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
        `);
      } catch (e) {}
    };

    await createTriggerSafe('update_users_updated_at', 'users');
    await createTriggerSafe('update_food_items_updated_at', 'food_items');
    await createTriggerSafe('update_orders_updated_at', 'orders');

    const userCheck = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) === 0) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@yoursite.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await pool.query(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        ['অ্যাডমিন', adminEmail, hashedPassword, 'admin']
      );
      console.log(`✅ অ্যাডমিন ইউজার তৈরি হয়েছে (email: ${adminEmail})`);
    }

    const foodCheck = await pool.query('SELECT COUNT(*) FROM food_items');
    if (parseInt(foodCheck.rows[0].count) === 0) {
      const foodItems = [
        ['কেক', 'তাজা এবং সুস্বাদু হোমমেড কেক, নববর্ষের বিশেষ স্বাদে তৈরি।', 80, 'খাবার', null, 1],
        ['ফ্লেভার্ড রসগোল্লা', 'বিভিন্ন ফ্লেভারে ভরা রসালো রসগোল্লা, মিষ্টি প্রেমীদের জন্য।', 50, 'খাবার', null, 2],
        ['মালাই পাটিসাপটা', 'ক্রিমি মালাই দিয়ে ভরা ঐতিহ্যবাহী পাটিসাপটা পিঠা।', 60, 'খাবার', null, 3],
        ['ফুলঝুরি পিঠা', 'খাস্তা এবং মচমচে ফুলঝুরি পিঠা, চায়ের সাথে পারফেক্ট।', 40, 'খাবার', null, 4],
        ['টিরামিসু', 'ইতালিয়ান স্টাইলে তৈরি প্রিমিয়াম টিরামিসু ডেজার্ট।', 120, 'খাবার', null, 5],
        ['ওভেন বেক পাস্তা', 'চিজি এবং ক্রিমি ওভেন বেকড পাস্তা, গরম গরম পরিবেশন।', 150, 'খাবার', null, 6],
        ['ভেলপুরি', 'ট্যাঙ্গি এবং স্পাইসি ভেলপুরি, স্ট্রিট ফুড লাভারদের পছন্দ।', 30, 'খাবার', null, 7],
        ['পাঁপড় ভাজা', 'কুড়মুড়ে এবং মচমচে পাঁপড় ভাজা, হালকা স্ন্যাকস।', 20, 'খাবার', null, 8],
        ['নকশী পিঠা', 'হাতে তৈরি সুন্দর নকশী পিঠা, বাঙালি ঐতিহ্যের প্রতীক।', 70, 'খাবার', null, 9],
        ['নিমকি', 'ঝরঝরে এবং মচমচে নিমকি, নোনতা স্ন্যাকস প্রেমীদের জন্য।', 25, 'খাবার', null, 10],
        ['ফ্রেঞ্চ ফ্রাই', 'গোল্ডেন ক্রিস্পি ফ্রেঞ্চ ফ্রাই, সস সহ পরিবেশন।', 60, 'খাবার', null, 11],
        ['সুজির বরফি', 'ঘি দিয়ে তৈরি মিষ্টি সুজির বরফি, মুখে গলে যায়।', 40, 'খাবার', null, 12],
        ['মুড়ির মোয়া ও নাড়ু', 'ঐতিহ্যবাহী মুড়ির মোয়া এবং নারকেল নাড়ু, দুটোই একসাথে।', 30, 'খাবার', null, 13],
      ];

      const juiceItems = [
        ['কোল্ড কফি', 'ক্রিমি এবং ঠান্ডা কোল্ড কফি, গরমে প্রাণ জুড়ায়।', 80, 'জুস', null, 14],
        ['ব্লু মোহিত', 'রিফ্রেশিং ব্লু কালারের ঠান্ডা মোহিত ড্রিংক।', 70, 'জুস', null, 15],
        ['ফালুদা', 'রোজ সিরাপ, দুধ, জেলি ও আইসক্রিম দিয়ে ক্লাসিক ফালুদা।', 100, 'জুস', null, 16],
        ['লেমন মিন্ট', 'তাজা লেবু এবং পুদিনা পাতার শীতল পানীয়।', 50, 'জুস', null, 17],
      ];

      const otherItems = [
        ['লটারি', 'ভাগ্য পরীক্ষা করুন! উত্তেজনাপূর্ণ পুরস্কার জিতে নিন।', 20, 'অন্যান্য', null, 19],
        ['হ্যান্ডমেড জুয়েলারী', 'হাতে তৈরি অনন্য এবং সুন্দর জুয়েলারী কালেকশন।', 150, 'অন্যান্য', null, 20],
        ['বায়োস্কোপ', 'নস্টালজিক বায়োস্কোপ অভিজ্ঞতা, চোখ রাখুন আর দেখুন।', 10, 'অন্যান্য', null, 21],
        ['ক্যানভাস', 'হাতে আঁকা শৈল্পিক ক্যানভাস আর্ট, ঘর সাজানোর জন্য।', 200, 'অন্যান্য', null, 22],
        ['বার্মিস আচার', 'ঝাল-মিষ্টি বার্মিস স্টাইলের ট্র্যাডিশনাল আচার।', 80, 'অন্যান্য', null, 23],
        ['মাটির জিনিসপত্র', 'শিল্পীদের হাতে তৈরি মাটির তৈজসপত্র ও শোপিস।', 100, 'অন্যান্য', null, 24],
        ['কি রিং', 'ইউনিক ডিজাইনের কাস্টম কি রিং, গিফট হিসেবে পারফেক্ট।', 30, 'অন্যান্য', null, 25],
        ['মুখোশ', 'রঙিন এবং ঐতিহ্যবাহী নববর্ষের মুখোশ।', 50, 'অন্যান্য', null, 26],
        ['নববর্ষের আলপনা (হাতে বা গালে)', 'পেশাদার শিল্পীর হাতে সুন্দর আলপনা আর্ট, হাতে বা গালে।', 30, 'অন্যান্য', null, 27],
      ];

      for (const item of [...foodItems, ...juiceItems, ...otherItems]) {
        await pool.query(
          'INSERT INTO food_items (name, description, price, category, combo_items, sort_order) VALUES ($1, $2, $3, $4, $5, $6)',
          item
        );
      }

      await pool.query(
        `INSERT INTO food_items (name, description, price, category, combo_items, sort_order) VALUES ($1, $2, $3, $4, $5, $6)`,
        ['বৈশাখী কম্বো প্লেট', 'নববর্ষের বিশেষ কম্বো — ভেলপুরি, নিমকি, ফুলঝুরি পিঠা এবং লেমন মিন্ট একসাথে। আলাদা কিনলে ১৪৫৳, কম্বোতে মাত্র ১২০৳!', 120, 'কম্বো', ['ভেলপুরি', 'নিমকি', 'ফুলঝুরি পিঠা', 'লেমন মিন্ট'], 18]
      );

      console.log('✅ ২৭টি আইটেম সিড ডাটা যোগ হয়েছে');
    }

    console.log('✅ ডাটাবেজ ইনিশিয়ালাইজেশন সম্পন্ন');
  } catch (err) {
    console.error('টেবিল তৈরি করতে সমস্যা:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
};
