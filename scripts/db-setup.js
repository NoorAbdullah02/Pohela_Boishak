import { initDatabase } from '../server/src/config/initDb.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server folder
dotenv.config({ path: path.join(__dirname, '../server/.env') });

console.log('🚀 ডাটাবেজ সেটআপ শুরু হচ্ছে...');

initDatabase()
  .then(() => {
    console.log('✨ ডাটাবেজ সেটআপ সফলভাবে সম্পন্ন হয়েছে!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ ডাটাবেজ সেটআপে সমস্যা:', err);
    process.exit(1);
  });
