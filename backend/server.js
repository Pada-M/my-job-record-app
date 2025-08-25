// backend/server.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import { authenticateToken } from "./middleware/auth.js";
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.query("SELECT NOW()")
  .then(res => console.log("DB connected:", res.rows[0]))
  .catch(err => console.error("DB connection error:", err));
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// In-memory users (you can later move users to DB)
const users = [];

// --- Routes ---

app.get('/users', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, created_at FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Signup
// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    // Check if user already exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0)
      return res.status(400).json({ error: 'User already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into DB
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, created_at',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0)
      return res.status(400).json({ error: 'Invalid credentials' });

    const user = userResult.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// GET all jobs
app.get("/jobs", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM jobs");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// POST a new job
app.post("/jobs", authenticateToken, async (req, res) => {
  try {
    const { role, company, description, status, location, job_type, salary, tags } = req.body;

    if (!role || !company) return res.status(400).json({ error: "Role and company required" });

    const query = `
      INSERT INTO jobs (role, company, description, status, location, job_type, salary, tags)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *;
    `;
    const values = [role, company, description || null, status || "Open", location || null, job_type || null, salary || null, tags || null];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error posting job:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// PATCH / update a job
app.patch('/jobs/:id', authenticateToken, async (req, res) => {
  const jobId = parseInt(req.params.id);
  if (isNaN(jobId)) return res.status(400).json({ error: "Invalid job ID" });

  // Destructure only the fields we allow updating
  const {
    role,
    company,
    description,
    status,
    location,
    job_type,
    salary,
    tags
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE jobs
       SET role = COALESCE($1, role),
           company = COALESCE($2, company),
           description = COALESCE($3, description),
           status = COALESCE($4, status),
           location = COALESCE($5, location),
           job_type = COALESCE($6, job_type),
           salary = COALESCE($7, salary),
           tags = COALESCE($8, tags),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [role, company, description, status, location, job_type, salary, tags, jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



// DELETE a job
app.delete('/jobs/:id', authenticateToken, async (req, res) => {
  const jobId = parseInt(req.params.id);
  try {
    const result = await pool.query("DELETE FROM jobs WHERE id=$1 RETURNING *", [jobId]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Job not found" });

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`));
