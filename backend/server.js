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

// Paths for built files
const userDistPath = path.join(__dirname, 'userfrontend', 'dist');
const adminDistPath = path.join(__dirname, 'adminfrontend', 'dist');

console.log('📁 User frontend build path:', userDistPath);
console.log('📁 Admin frontend build path:', adminDistPath);

// API Routes (add your backend API endpoints here)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

// Serve static files after API routes
const fs = require('fs');

// Check if builds exist and serve them
if (fs.existsSync(userDistPath)) {
  app.use(express.static(userDistPath));
  console.log('✅ Serving user frontend from:', userDistPath);
  
  // User frontend routes
  app.get('/', (req, res) => {
    res.sendFile(path.join(userDistPath, 'index.html'));
  });
} else {
  console.log('⚠️ User frontend not built yet. Run "npm run build:user"');
  app.get('/', (req, res) => {
    res.send('User frontend is building. Please check back in a minute.');
  });
}

if (fs.existsSync(adminDistPath)) {
  app.use('/admin', express.static(adminDistPath));
  console.log('✅ Serving admin frontend from:', adminDistPath);
  
  // Admin frontend routes (support React Router)
  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(adminDistPath, 'index.html'));
  });
} else {
  console.log('⚠️ Admin frontend not built yet. Run "npm run build:admin"');
}

// Catch-all route - send user frontend for SPA routing
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(userDistPath, 'index.html'))) {
    res.sendFile(path.join(userDistPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 User app: https://foodprep1-ulgn.onrender.com`);
  console.log(`👑 Admin app: https://foodprep1-ulgn.onrender.com/admin`);
  console.log(`💚 Health check: https://foodprep1-ulgn.onrender.com/api/health`);
});
