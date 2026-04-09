import { Router } from 'express';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendOrderConfirmation, sendAdminNewOrderNotification } from '../services/email.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const { customer_name, customer_email, customer_phone, items, payment_method, notes } = req.body;

    if (!customer_name || !customer_email || !items || !items.length || !payment_method) {
      return res.status(400).json({ message: 'সব তথ্য পূরণ করুন।' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({ message: 'সঠিক ইমেইল দিন।' });
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const foodResult = await query('SELECT * FROM food_items WHERE id = $1', [item.id]);
      if (foodResult.rows.length === 0) {
        return res.status(400).json({ message: `"${item.name}" আইটেমটি পাওয়া যায়নি।` });
      }

      const food = foodResult.rows[0];
      if (!food.in_stock) {
        return res.status(400).json({ message: `"${food.name}" স্টকে নেই।` });
      }

      const itemTotal = parseFloat(food.price) * (item.quantity || 1);
      totalAmount += itemTotal;

      validatedItems.push({
        id: food.id,
        name: food.name,
        price: parseFloat(food.price),
        quantity: item.quantity || 1,
        category: food.category,
      });
    }

    const result = await query(
      `INSERT INTO orders (customer_name, customer_email, customer_phone, items, total_amount, payment_method, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [customer_name, customer_email, customer_phone, JSON.stringify(validatedItems), totalAmount, payment_method, notes || null]
    );

    const order = result.rows[0];
    order.items = validatedItems;

    sendOrderConfirmation(order).catch(err => console.error('কাস্টমার ইমেইল সমস্যা:', err));
    sendAdminNewOrderNotification(order).catch(err => console.error('অ্যাডমিন ইমেইল সমস্যা:', err));

    res.status(201).json({
      message: 'অর্ডার সফলভাবে প্লেস হয়েছে!',
      order: {
        id: order.id,
        order_number: order.order_number,
        total_amount: order.total_amount,
        status: order.status,
      },
    });
  } catch (error) {
    console.error('অর্ডার সমস্যা:', error);
    res.status(500).json({ message: 'অর্ডার প্লেস করতে সমস্যা হয়েছে।' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let result;
    let countResult;

    if (status && status !== 'সব') {
      result = await query(
        'SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [status, parseInt(limit), offset]
      );
      countResult = await query('SELECT COUNT(*) FROM orders WHERE status = $1', [status]);
    } else {
      result = await query(
        'SELECT * FROM orders ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [parseInt(limit), offset]
      );
      countResult = await query('SELECT COUNT(*) FROM orders');
    }

    res.json({
      orders: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / parseInt(limit)),
    });
  } catch (error) {
    console.error('অর্ডার লোড সমস্যা:', error);
    res.status(500).json({ message: 'অর্ডার লোড করতে সমস্যা হয়েছে।' });
  }
});

router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['অপেক্ষমান', 'নিশ্চিত', 'সম্পন্ন', 'বাতিল'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'অবৈধ স্ট্যাটাস।' });
    }

    const result = await query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'অর্ডার পাওয়া যায়নি।' });
    }

    res.json({ message: 'অর্ডার স্ট্যাটাস আপডেট হয়েছে!', order: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।' });
  }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const totalOrders = await query('SELECT COUNT(*) FROM orders');
    const totalRevenue = await query('SELECT COALESCE(SUM(total_amount), 0) as total FROM orders WHERE status != $1', ['বাতিল']);
    const pendingOrders = await query("SELECT COUNT(*) FROM orders WHERE status = 'অপেক্ষমান'");
    const todayOrders = await query("SELECT COUNT(*) FROM orders WHERE created_at::date = CURRENT_DATE");

    res.json({
      totalOrders: parseInt(totalOrders.rows[0].count),
      totalRevenue: parseFloat(totalRevenue.rows[0].total),
      pendingOrders: parseInt(pendingOrders.rows[0].count),
      todayOrders: parseInt(todayOrders.rows[0].count),
    });
  } catch (error) {
    res.status(500).json({ message: 'পরিসংখ্যান লোড করতে সমস্যা হয়েছে।' });
  }
});

export default router;
