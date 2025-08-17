// backend/server.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from "./middleware/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory users
const users = [];

// Shared jobs array
const jobs = [
  { id: 1, title: "Frontend Developer", company: "Tech Corp" },
  { id: 2, title: "Backend Engineer", company: "Code Labs" },
  { id: 3, title: "Full Stack Developer", company: "Startup Hub" }
];
let idCounter = jobs.length + 1; // Next id starts after the initial jobs

// --- Routes ---

// Get all users (for testing)
app.get('/users', (req, res) => {
  res.json(users);
});

// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const userExists = users.find(u => u.email === email);
  if (userExists) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

// Login
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

// GET all jobs (protected)
app.get("/jobs", authenticateToken, (req, res) => {
  res.json(jobs);
});

// POST a new job (protected)
app.post('/jobs', authenticateToken, (req, res) => {
  const { title, company, description } = req.body;
  const newJob = { id: idCounter++, title, company, description };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// Start server
app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
