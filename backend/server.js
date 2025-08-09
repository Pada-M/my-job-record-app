// backend/server.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const users = []; // For now, store users in-memory (replace with DB later)

// Signup route
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

  // Create JWT token
  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
