const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://pranavi23bce8014:103komqBu6c72ln0@cluster0.f2x9ysd.mongodb.net/foodprep1';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('DB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.static('userfrontend')); // Serve user frontend as main

// Routes for different frontends
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'adminfrontend', 'index.html'));
});

// Your API routes here (if any)
app.get('/api', (req, res) => {
  res.json({ message: 'API Working' });
});

// Serve user frontend for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'userfrontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
