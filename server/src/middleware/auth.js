import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'অনুমতি নেই। অনুগ্রহ করে লগইন করুন।' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'টোকেন মেয়াদোত্তীর্ণ।', expired: true });
    }
    return res.status(403).json({ message: 'অবৈধ টোকেন।' });
  }
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};
