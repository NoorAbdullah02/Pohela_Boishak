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
      console.log('ডাটাবেজ "pohela_boishakh" তৈরি হয়েছে');
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
      console.log('✅ কোনো সিড ডাটা যোগ করা হয়নি');
    }

    console.log('✅ ডাটাবেজ ইনিশিয়ালাইজেশন সম্পন্ন');
  } catch (err) {
    console.error('টেবিল তৈরি করতে সমস্যা:', err.message);
    throw err;
  } finally {
    await pool.end();
  }
};
