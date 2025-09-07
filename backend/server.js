/**
 * Simple Expense Tracker backend
 * - Stores users and expenses in JSON files (backend/data)
 * - Endpoints:
 *   POST /api/register    { name, email, password }
 *   POST /api/login       { email, password }
 *   GET  /api/expenses    (auth)
 *   POST /api/expenses    { title, amount, category, date } (auth)
 *   DELETE /api/expenses/:id  (auth)
 *
 * NOTE: This is a simple file-based backend intended for demo / learning.
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EXP_FILE = path.join(DATA_DIR, 'expenses.json');
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_a_real_secret';

// helpers
function readJSON(file) {
  if (!fs.existsSync(file)) return [];
  try {
    const raw = fs.readFileSync(file);
    return JSON.parse(raw || "[]");
  } catch (e) {
    console.error('readJSON error', e);
    return [];
  }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
  if (!fs.existsSync(USERS_FILE)) writeJSON(USERS_FILE, []);
  if (!fs.existsSync(EXP_FILE)) writeJSON(EXP_FILE, []);
}
ensureDataFiles();

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Register
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const users = readJSON(USERS_FILE);
  if (users.find(u => u.email === email)) return res.status(400).json({ message: 'Email already registered' });

  const hashed = bcrypt.hashSync(password, 8);
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  const user = { id, name, email, password: hashed, createdAt: new Date().toISOString() };
  users.push(user);
  writeJSON(USERS_FILE, users);

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  res.json({ user: safeUser, token });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const users = readJSON(USERS_FILE);
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const ok = bcrypt.compareSync(password, user.password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  const safeUser = { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  res.json({ user: safeUser, token });
});

// Get expenses for logged-in user
app.get('/api/expenses', authMiddleware, (req, res) => {
  const exps = readJSON(EXP_FILE);
  const mine = exps.filter(e => e.userId === req.user.id);
  res.json(mine);
});

// Add expense
app.post('/api/expenses', authMiddleware, (req, res) => {
  const { title, amount, category, date } = req.body || {};
  if (!title || !amount) return res.status(400).json({ message: 'title and amount required' });

  const exps = readJSON(EXP_FILE);
  const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2,8);
  const item = { id, userId: req.user.id, title, amount: Number(amount), category: category || 'General', date: date || new Date().toISOString() };
  exps.push(item);
  writeJSON(EXP_FILE, exps);
  res.json(item);
});

// Delete expense
app.delete('/api/expenses/:id', authMiddleware, (req, res) => {
  const id = req.params.id;
  let exps = readJSON(EXP_FILE);
  const idx = exps.findIndex(e => e.id === id && e.userId === req.user.id);
  if (idx === -1) return res.status(404).json({ message: 'Expense not found' });
  const removed = exps.splice(idx, 1)[0];
  writeJSON(EXP_FILE, exps);
  res.json({ message: 'Deleted', removed });
});

app.get('/api/ping', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log('Expense-tracker backend running on port', PORT);
});