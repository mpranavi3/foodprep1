const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pranavi23bce8014:103komqBu6c72ln0@cluster0.f2x9ysd.mongodb.net/foodprep1';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ============ API ROUTES (Add these BEFORE static files) ============

// Food list endpoint
app.get('/api/food/list', (req, res) => {
  const sampleFoods = [
    { _id: "1", name: "Margherita Pizza", price: 12.99, category: "Pizza", description: "Delicious cheese pizza" },
    { _id: "2", name: "Burger", price: 8.99, category: "Burger", description: "Juicy beef burger" },
    { _id: "3", name: "Pasta", price: 10.99, category: "Pasta", description: "Creamy Alfredo pasta" },
    { _id: "4", name: "Salad", price: 6.99, category: "Salad", description: "Fresh garden salad" },
    { _id: "5", name: "Chicken Wings", price: 9.99, category: "Appetizer", description: "Spicy chicken wings" },
    { _id: "6", name: "Ice Cream", price: 4.99, category: "Dessert", description: "Vanilla ice cream" }
  ];
  
  res.json({
    success: true,
    data: sampleFoods
  });
});

// Get cart endpoint
app.get('/api/cart/get', (req, res) => {
  const token = req.headers.token;
  res.json({
    success: true,
    cartData: {}
  });
});

// Add to cart endpoint
app.post('/api/cart/add', (req, res) => {
  const { itemId } = req.body;
  res.json({
    success: true,
    message: "Item added to cart"
  });
});

// Remove from cart endpoint
app.delete('/api/cart/remove', (req, res) => {
  const { itemId } = req.query;
  res.json({
    success: true,
    message: "Item removed from cart"
  });
});

// Login endpoint
app.post('/api/user/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "test@example.com" && password === "password") {
    res.json({
      success: true,
      token: "demo-token-123",
      message: "Login successful"
    });
  } else {
    res.json({
      success: false,
      message: "Invalid credentials"
    });
  }
});

// Register endpoint
app.post('/api/user/register', (req, res) => {
  res.json({
    success: true,
    token: "demo-token-123",
    message: "User registered successfully"
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

// ============ STATIC FILE SERVING ============

const userDistPath = path.join(__dirname, 'userfrontend', 'dist');
const adminDistPath = path.join(__dirname, 'adminfrontend', 'dist');

console.log('📍 User frontend build path:', userDistPath);
console.log('📍 Admin frontend build path:', adminDistPath);

const fs = require('fs');

if (fs.existsSync(userDistPath)) {
  app.use(express.static(userDistPath));
  console.log('✅ Serving user frontend');
}

if (fs.existsSync(adminDistPath)) {
  app.use('/admin', express.static(adminDistPath));
  console.log('✅ Serving admin frontend');
}

// ============ FRONTEND ROUTES ============

app.get('/', (req, res) => {
  const indexPath = path.join(userDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('User frontend building...');
  }
});

app.get('/admin', (req, res) => {
  const indexPath = path.join(adminDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Admin frontend building...');
  }
});

app.get('/admin/*', (req, res) => {
  const indexPath = path.join(adminDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Admin frontend building...');
  }
});

// Catch-all for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(userDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Page not found');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
