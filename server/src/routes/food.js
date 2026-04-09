import { Router } from 'express';
import multer from 'multer';
import { extname } from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendAdminStockAlert } from '../services/email.js';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pohela_boishakh/food',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('শুধুমাত্র ছবি ফাইল গ্রহণযোগ্য।'));
    }
  },
});

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let result;

    if (category && category !== 'সব') {
      result = await query(
        'SELECT * FROM food_items WHERE category = $1 ORDER BY sort_order ASC',
        [category]
      );
    } else {
      result = await query('SELECT * FROM food_items ORDER BY sort_order ASC');
    }

    res.json({ items: result.rows });
  } catch (error) {
    console.error('আইটেম লোড সমস্যা:', error);
    res.status(500).json({ message: 'আইটেম লোড করতে সমস্যা হয়েছে।' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM food_items WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'আইটেম পাওয়া যায়নি।' });
    }
    res.json({ item: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, combo_items, sort_order, image_url } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ message: 'নাম, দাম এবং ক্যাটাগরি আবশ্যক।' });
    }

    // Use image_url from client (Cloudinary) or file from multer
    const imageUrlValue = image_url || (req.file ? req.file.path : null);
    const comboArray = combo_items ? JSON.parse(combo_items) : null;

    const result = await query(
      `INSERT INTO food_items (name, description, price, category, image_url, combo_items, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description, parseFloat(price), category, imageUrlValue, comboArray, parseInt(sort_order) || 0]
    );

    res.status(201).json({ message: 'আইটেম যোগ হয়েছে!', item: result.rows[0] });
  } catch (error) {
    console.error('আইটেম যোগ সমস্যা:', error);
    res.status(500).json({ message: 'আইটেম যোগ করতে সমস্যা হয়েছে।' });
  }
});

router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, combo_items, sort_order, in_stock, image_url } = req.body;
    const { id } = req.params;

    const existing = await query('SELECT * FROM food_items WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ message: 'আইটেম পাওয়া যায়নি।' });
    }

    // Use image_url from client (Cloudinary), file from multer, or existing
    const imageUrlValue = image_url || (req.file ? req.file.path : existing.rows[0].image_url);

    const comboArray = combo_items ? JSON.parse(combo_items) : existing.rows[0].combo_items;

    const result = await query(
      `UPDATE food_items SET
        name = $1, description = $2, price = $3, category = $4,
        image_url = $5, combo_items = $6, sort_order = $7, in_stock = $8
       WHERE id = $9 RETURNING *`,
      [
        name || existing.rows[0].name,
        description !== undefined ? description : existing.rows[0].description,
        price ? parseFloat(price) : existing.rows[0].price,
        category || existing.rows[0].category,
        imageUrlValue,
        comboArray,
        sort_order !== undefined ? parseInt(sort_order) : existing.rows[0].sort_order,
        in_stock !== undefined ? in_stock === 'true' || in_stock === true : existing.rows[0].in_stock,
        id,
      ]
    );

    res.json({ message: 'আইটেম আপডেট হয়েছে!', item: result.rows[0] });
  } catch (error) {
    console.error('আইটেম আপডেট সমস্যা:', error);
    res.status(500).json({ message: 'আইটেম আপডেট করতে সমস্যা হয়েছে।' });
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await query('DELETE FROM food_items WHERE id = $1 RETURNING name', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'আইটেম পাওয়া যায়নি।' });
    }
    res.json({ message: `"${result.rows[0].name}" মুছে ফেলা হয়েছে!` });
  } catch (error) {
    res.status(500).json({ message: 'আইটেম মুছতে সমস্যা হয়েছে।' });
  }
});

router.patch('/:id/stock', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'UPDATE food_items SET in_stock = NOT in_stock WHERE id = $1 RETURNING *',
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'আইটেম পাওয়া যায়নি।' });
    }

    const item = result.rows[0];

    if (!item.in_stock) {
      sendAdminStockAlert(item).catch(err => console.error('স্টক ইমেইল সমস্যা:', err));
    }

    res.json({
      message: item.in_stock ? `"${item.name}" এখন স্টকে আছে` : `"${item.name}" স্টক শেষ`,
      item,
    });
  } catch (error) {
    res.status(500).json({ message: 'স্টক আপডেট করতে সমস্যা হয়েছে।' });
  }
});

export default router;
