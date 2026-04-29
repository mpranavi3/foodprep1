const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pranavi23bce8014:103komqBu6c72ln0@cluster0.f2x9ysd.mongodb.net/foodprep1';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(express.json());

// Serve static files (check both possible locations)
const userDistPath = path.join(__dirname, 'userfrontend', 'dist');
const adminDistPath = path.join(__dirname, 'adminfrontend', 'dist');

console.log('User frontend path:', userDistPath);
console.log('Admin frontend path:', adminDistPath);

// Check if dist folders exist and serve them
const fs = require('fs');
if (fs.existsSync(userDistPath)) {
  app.use(express.static(userDistPath));
  console.log('✅ Serving user frontend from:', userDistPath);
} else {
  console.log('⚠️ User frontend dist not found at:', userDistPath);
}

if (fs.existsSync(adminDistPath)) {
  app.use('/admin', express.static(adminDistPath));
  console.log('✅ Serving admin frontend from:', adminDistPath);
} else {
  console.log('⚠️ Admin frontend dist not found at:', adminDistPath);
}

// API Routes (add your backend API routes here)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mongodb: mongoose.connection.readyState === 1 });
});

// Frontend Routes
app.get('/', (req, res) => {
  const indexPath = path.join(userDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('User frontend not built yet. Run "npm run build" first.');
  }
});

app.get('/admin*', (req, res) => {
  const indexPath = path.join(adminDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Admin frontend not built yet. Run "npm run build" first.');
  }
});

// Catch-all - send user frontend for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(userDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Page not found. Build the frontend first.');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 User app: https://foodprep1-ulgn.onrender.com`);
  console.log(`👑 Admin app: https://foodprep1-ulgn.onrender.com/admin`);
});const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 10000;
const PROJECT_ROOT = path.join(__dirname, '..'); // Go up from backend folder

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://pranavi23bce8014:103komqBu6c72ln0@cluster0.f2x9ysd.mongodb.net/foodprep1';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('DB connected'))
  .catch(err => console.error('DB connection error:', err));

// Middleware
app.use(express.json());

// Serve static files
app.use(express.static(path.join(PROJECT_ROOT, 'userfrontend')));
app.use('/admin', express.static(path.join(PROJECT_ROOT, 'adminfrontend')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'userfrontend', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'adminfrontend', 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({ message: 'API Working' });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
