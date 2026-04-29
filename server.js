const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Go up one level from backend folder to reach root
const ROOT_PATH = path.join(__dirname, '..');

// Paths for built files - CORRECTED
const userDistPath = path.join(ROOT_PATH, 'userfrontend', 'dist');
const adminDistPath = path.join(ROOT_PATH, 'adminfrontend', 'dist');

console.log('📁 Root path:', ROOT_PATH);
console.log('📁 User frontend build path:', userDistPath);
console.log('📁 Admin frontend build path:', adminDistPath);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pranavi23bce8014:103komqBu6c72ln0@cluster0.f2x9ysd.mongodb.net/foodprep1';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

const fs = require('fs');

// Check if builds exist and serve them
if (fs.existsSync(userDistPath)) {
  app.use(express.static(userDistPath));
  console.log('✅ Serving user frontend from:', userDistPath);
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(userDistPath, 'index.html'));
  });
} else {
  console.log('⚠️ User frontend not built yet. Run "npm run build:user"');
  console.log('   Expected at:', userDistPath);
  app.get('/', (req, res) => {
    res.send('User frontend is building. Check back in a minute.');
  });
}

if (fs.existsSync(adminDistPath)) {
  app.use('/admin', express.static(adminDistPath));
  console.log('✅ Serving admin frontend from:', adminDistPath);
  
  app.get('/admin*', (req, res) => {
    res.sendFile(path.join(adminDistPath, 'index.html'));
  });
} else {
  console.log('⚠️ Admin frontend not built yet. Run "npm run build:admin"');
  console.log('   Expected at:', adminDistPath);
}

// Catch-all route
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(userDistPath, 'index.html'))) {
    res.sendFile(path.join(userDistPath, 'index.html'));
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
