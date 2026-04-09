import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { query } from '../config/db.js';
import { authenticateToken, generateAccessToken, generateRefreshToken } from '../middleware/auth.js';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

const router = Router();

const RP_NAME = process.env.RP_NAME || 'শুভ নববর্ষ ICE';
const RP_ID = process.env.RP_ID || 'localhost';
const RP_ORIGIN = process.env.RP_ORIGIN || 'http://localhost:3000';

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'ইমেইল এবং পাসওয়ার্ড দিন।' });
    }

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'ভুল ইমেইল বা পাসওয়ার্ড।' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'ভুল ইমেইল বা পাসওয়ার্ড।' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await query(
      'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokenHash, expiresAt]
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    res.json({
      message: 'লগইন সফল!',
      accessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('লগইন সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/register', authenticateToken, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'সব তথ্য পূরণ করুন।' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'এই ইমেইল ইতিমধ্যে ব্যবহৃত।' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: 'অ্যাডমিন তৈরি হয়েছে!', user: result.rows[0] });
  } catch (error) {
    console.error('রেজিস্ট্রেশন সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'রিফ্রেশ টোকেন পাওয়া যায়নি।' });
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const tokenResult = await query(
      'SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked = FALSE AND expires_at > NOW()',
      [tokenHash]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(401).json({ message: 'অবৈধ বা মেয়াদোত্তীর্ণ টোকেন।' });
    }

    const storedToken = tokenResult.rows[0];
    const userResult = await query('SELECT * FROM users WHERE id = $1', [storedToken.user_id]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: 'ইউজার পাওয়া যায়নি।' });
    }

    const user = userResult.rows[0];
    const newAccessToken = generateAccessToken(user);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('টোকেন রিফ্রেশ সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash]);
    }

    res.clearCookie('refreshToken', { path: '/' });
    res.json({ message: 'লগআউট সফল!' });
  } catch (error) {
    console.error('লগআউট সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await query('SELECT id, name, email, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি।' });
    }
    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/webauthn/register-options', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const existingCreds = await query(
      'SELECT credential_id FROM webauthn_credentials WHERE user_id = $1',
      [user.id]
    );

    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: RP_ID,
      userID: user.id,
      userName: user.email,
      attestationType: 'none',
      excludeCredentials: existingCreds.rows.map(cred => ({
        id: cred.credential_id,
        type: 'public-key',
      })),
    });

    await query('UPDATE users SET current_challenge = $1 WHERE id = $2', [options.challenge, user.id]);
    res.json(options);
  } catch (error) {
    console.error('WebAuthn রেজিস্ট্রেশন সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/webauthn/register-verify', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    const userResult = await query('SELECT current_challenge FROM users WHERE id = $1', [user.id]);
    const expectedChallenge = userResult.rows[0].current_challenge;

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter } = verification.registrationInfo;

      await query(
        `INSERT INTO webauthn_credentials (user_id, credential_id, public_key, counter, device_type, backed_up, transports)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          user.id,
          Buffer.from(credentialID).toString('base64url'),
          Buffer.from(credentialPublicKey).toString('base64url'),
          counter,
          verification.registrationInfo.credentialDeviceType || 'singleDevice',
          verification.registrationInfo.credentialBackedUp || false,
          req.body.response?.transports || [],
        ]
      );

      await query('UPDATE users SET current_challenge = NULL WHERE id = $1', [user.id]);
      res.json({ verified: true, message: 'WebAuthn ডিভাইস যোগ হয়েছে!' });
    } else {
      res.status(400).json({ verified: false, message: 'যাচাই ব্যর্থ।' });
    }
  } catch (error) {
    console.error('WebAuthn ভেরিফিকেশন সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/webauthn/login-options', async (req, res) => {
  try {
    const { email } = req.body;
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি।' });
    }

    const userId = userResult.rows[0].id;
    const creds = await query('SELECT * FROM webauthn_credentials WHERE user_id = $1', [userId]);

    const options = await generateAuthenticationOptions({
      rpID: RP_ID,
      allowCredentials: creds.rows.map(cred => ({
        id: cred.credential_id,
        type: 'public-key',
        transports: cred.transports || [],
      })),
    });

    await query('UPDATE users SET current_challenge = $1 WHERE id = $2', [options.challenge, userId]);
    res.json({ ...options, userId });
  } catch (error) {
    console.error('WebAuthn লগইন সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

router.post('/webauthn/login-verify', async (req, res) => {
  try {
    const { userId, response: authResponse } = req.body;
    const userResult = await query('SELECT * FROM users WHERE id = $1', [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'ইউজার পাওয়া যায়নি।' });
    }

    const user = userResult.rows[0];
    const credResult = await query(
      'SELECT * FROM webauthn_credentials WHERE credential_id = $1 AND user_id = $2',
      [authResponse.id, userId]
    );

    if (credResult.rows.length === 0) {
      return res.status(400).json({ message: 'অবৈধ ক্রেডেনশিয়াল।' });
    }

    const credential = credResult.rows[0];

    const verification = await verifyAuthenticationResponse({
      response: authResponse,
      expectedChallenge: user.current_challenge,
      expectedOrigin: RP_ORIGIN,
      expectedRPID: RP_ID,
      authenticator: {
        credentialID: credential.credential_id,
        credentialPublicKey: Buffer.from(credential.public_key, 'base64url'),
        counter: parseInt(credential.counter),
      },
    });

    if (verification.verified) {
      await query(
        'UPDATE webauthn_credentials SET counter = $1 WHERE id = $2',
        [verification.authenticationInfo.newCounter, credential.id]
      );
      await query('UPDATE users SET current_challenge = NULL WHERE id = $1', [userId]);

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await query(
        'INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)',
        [user.id, tokenHash, expiresAt]
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
      });

      res.json({
        verified: true,
        accessToken,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } else {
      res.status(400).json({ verified: false, message: 'যাচাই ব্যর্থ।' });
    }
  } catch (error) {
    console.error('WebAuthn লগইন ভেরিফিকেশন সমস্যা:', error);
    res.status(500).json({ message: 'সার্ভারে সমস্যা হয়েছে।' });
  }
});

export default router;
