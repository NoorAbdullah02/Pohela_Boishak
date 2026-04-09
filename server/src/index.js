import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRoutes from './routes/auth.js';
import foodRoutes from './routes/food.js';
import orderRoutes from './routes/orders.js';
import { initDatabase } from './config/initDb.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      "img-src": ["'self'", "data:", "blob:", "*"],
    },
  },
}));
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://pohela-boishak.onrender.com',
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:6000' // Supporting the previously requested port too
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback for local dev
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/orders', orderRoutes);

// Serve static files from the Next.js export
const clientOutPath = join(__dirname, '../../client/out');

// Middleware to log file requests (helpful for debugging 404s on Render)
app.use((req, res, next) => {
  if (req.url.startsWith('/_next/') || req.url.endsWith('.js') || req.url.endsWith('.css')) {
    console.log(`📡 Requesting static asset: ${req.url}`);
  }
  next();
});

// CRITICAL: Handle clean URLs for static export (e.g., /admin/login -> admin/login.html)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.url.startsWith('/api/') && !req.url.includes('.')) {
    const cleanPath = req.url.replace(/\/$/, '') || '/index';
    const htmlPath = join(clientOutPath, `${cleanPath}.html`);
    
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    }
  }
  next();
});

app.use(express.static(clientOutPath, {
  extensions: ['html', 'txt', 'svg', 'ico'],
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript');
    }
  }
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'শুভ নববর্ষ! সার্ভার চালু আছে। 🎉' });
});

// Catch-all route to serve the frontend (Next.js) for SPA navigation
app.get('*', (req, res) => {
  const filePath = join(clientOutPath, 'index.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      // If index.html is missing, something is wrong with the build
      res.status(404).json({ message: 'Requested page not found.' });
    }
  });
});

app.use((err, req, res, next) => {
  console.error('সার্ভার এরর:', err);
  res.status(500).json({ message: 'সার্ভারে অভ্যন্তরীণ সমস্যা হয়েছে।' });
});

const start = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🎉 শুভ নববর্ষ সার্ভার পোর্ট ${PORT} এ চালু হয়েছে`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('সার্ভার শুরু করতে ব্যর্থ:', err);
    process.exit(1);
  }
};

start();
