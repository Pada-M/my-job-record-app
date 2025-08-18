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

// Shared jobs array with status
const jobs = [
  { id: 1, role: "Frontend Developer", company: "Tech Corp", description: "", status: "Open" },
  { id: 2, role: "Backend Engineer", company: "Code Labs", description: "", status: "Open" },
  { id: 3, role: "Full Stack Developer", company: "Startup Hub", description: "", status: "Open" }
];
let idCounter = jobs.length + 1; // Next id starts after the initial jobs

// --- Routes ---

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

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

// GET all jobs (protected)
app.get("/jobs", authenticateToken, (req, res) => {
  res.json(jobs);
});

app.post('/jobs', authenticateToken, (req, res) => {
  const { role, company, description, status } = req.body;
  const newJob = { id: idCounter++, role, company, description, status: status || "Open" };
  jobs.push(newJob);
  res.status(201).json(newJob);
});

// Update job status (protected)
app.patch('/jobs/:id/status', authenticateToken, (req, res) => {
  const jobId = parseInt(req.params.id);
  const { status } = req.body;

  const job = jobs.find((j) => j.id === jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });

  job.status = status;
  res.json(job);
});

app.delete('/jobs/:id', authenticateToken, (req, res) => {
  const jobId = parseInt(req.params.id);
  const index = jobs.findIndex(j => j.id === jobId);
  if (index === -1) return res.status(404).json({ error: "Job not found" });

  const deletedJob = jobs.splice(index, 1)[0];
  res.json(deletedJob);
});

app.patch('/jobs/:id', authenticateToken, (req, res) => {
  const jobId = parseInt(req.params.id);
  const { role, company, description, status } = req.body;

  const job = jobs.find(j => j.id === jobId);
  if (!job) return res.status(404).json({ error: "Job not found" });

  job.role = role ?? job.role;
  job.company = company ?? job.company;
  job.description = description ?? job.description;
  job.status = status ?? job.status;

  res.json(job);
});


app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
