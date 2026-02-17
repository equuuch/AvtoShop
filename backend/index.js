const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const { validationResult } = require('express-validator');
const { validateProduct, validateClient, validateReview } = require('./validators');

const app = express();
const port = process.env.PORT || 5000;

const JWT_SECRET = 'your_super_secret_key_change_this';

app.use(cors());
app.use(express.json());

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};


// --- AUTHENTICATION ROUTES ---

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const { rows } = await db.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, password_hash]
    );
    res.status(201).json({ message: 'User created successfully', user: rows[0] });
  } catch (err) {
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Username already exists' });
    }
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  try {
    const { rows } = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- MIDDLEWARE FOR PROTECTED ROUTES ---

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

// --- PRODUCTS API ROUTES ---

app.get('/api/products', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/products', authenticateToken, validateProduct, handleValidationErrors, async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
      [name, description, price]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/products/:id', authenticateToken, validateProduct, handleValidationErrors, async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
      [name, description, price, id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- CLIENTS API ROUTES ---

app.get('/api/clients', authenticateToken, async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM clients ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        console.error('Error fetching clients:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/clients', authenticateToken, validateClient, handleValidationErrors, async (req, res) => {
    const { name, phone, car } = req.body;
    try {
        const { rows } = await db.query(
            'INSERT INTO clients (name, phone, car) VALUES ($1, $2, $3) RETURNING *',
            [name, phone, car]
        );
        res.status(201).json(rows[0]);
    } catch (err) {
        console.error('Error creating client:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/clients/:id', authenticateToken, validateClient, handleValidationErrors, async (req, res) => {
    const { id } = req.params;
    const { name, phone, car } = req.body;
    try {
        const { rows } = await db.query(
            'UPDATE clients SET name = $1, phone = $2, car = $3 WHERE id = $4 RETURNING *',
            [name, phone, car, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error updating client:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/clients/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM clients WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (err) {
        console.error('Error deleting client:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// --- REVIEWS API ROUTES ---

app.get('/api/reviews', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM reviews ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/reviews', validateReview, handleValidationErrors, async (req, res) => {
  const { name, text, rating } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO reviews (name, text, rating) VALUES ($1, $2, $3) RETURNING *',
      [name, text, rating]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/reviews/:id', authenticateToken, validateReview, handleValidationErrors, async (req, res) => {
  const { id } = req.params;
  const { name, text, rating } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE reviews SET name = $1, text = $2, rating = $3 WHERE id = $4 RETURNING *',
      [name, text, rating, id]
    );
    if (rows.length === 0) {
        return res.status(404).json({ error: 'Review not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating review:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/reviews/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM reviews WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Review not found' });
    }
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
