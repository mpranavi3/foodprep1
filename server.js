const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Paths for built files - server is at root level
const userDistPath = path.join(__dirname, 'userfrontend', 'dist');
const adminDistPath = path.join(__dirname, 'adminfrontend', 'dist');

console.log('📍 Server running from:', __dirname);
console.log('📍 User frontend build path:', userDistPath);
console.log('📍 Admin frontend build path:', adminDistPath);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://pranavi23bce8014:103komqBu6c72ln0@cluster0.f2x9ysd.mongodb.net/foodprep1';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1,
    timestamp: new Date()
  });
});

// Test route to check if server is working
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Server Test</title>
      <style>
        body { font-family: Arial; padding: 20px; text-align: center; }
        .success { color: green; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>✅ Server is Running!</h1>
      <p>If you see this, the server is working correctly.</p>
      <p>Check the browser console for React app errors (F12).</p>
      <div>
        <h3>Debug Info:</h3>
        <p>User Dist Path: ${userDistPath}</p>
        <p>Admin Dist Path: ${adminDistPath}</p>
      </div>
    </body>
    </html>
  `);
});

const fs = require('fs');

// Debug endpoint to check file structure
app.get('/debug', (req, res) => {
  const userDistExists = fs.existsSync(userDistPath);
  const adminDistExists = fs.existsSync(adminDistPath);
  
  let debug = {
    serverLocation: __dirname,
    userDistPath: userDistPath,
    userDistExists: userDistExists,
    adminDistPath: adminDistPath,
    adminDistExists: adminDistExists,
    timestamp: new Date().toISOString()
  };
  
  if (userDistExists) {
    debug.userDistContents = fs.readdirSync(userDistPath);
    const indexPath = path.join(userDistPath, 'index.html');
    debug.indexExists = fs.existsSync(indexPath);
    if (debug.indexExists) {
      debug.indexHtmlPreview = fs.readFileSync(indexPath, 'utf8').substring(0, 300);
    }
  }
  
  if (adminDistExists) {
    debug.adminDistContents = fs.readdirSync(adminDistPath);
  }
  
  res.json(debug);
});

// Serve static files if builds exist
if (fs.existsSync(userDistPath)) {
  app.use(express.static(userDistPath));
  console.log('✅ Serving user frontend from:', userDistPath);
} else {
  console.log('⚠️ User frontend not built yet at:', userDistPath);
}

if (fs.existsSync(adminDistPath)) {
  app.use('/admin', express.static(adminDistPath));
  console.log('✅ Serving admin frontend from:', adminDistPath);
} else {
  console.log('⚠️ Admin frontend not built yet at:', adminDistPath);
}

// Main route - serve user frontend
app.get('/', (req, res) => {
  const indexPath = path.join(userDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <html>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>⏳ Building in Progress</h1>
          <p>Your React app is being built. Please refresh in a minute.</p>
          <p>Path: ${userDistPath}</p>
          <a href="/debug">Check Debug Info</a>
        </body>
      </html>
    `);
  }
});

// Admin route
app.get('/admin', (req, res) => {
  const indexPath = path.join(adminDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('Admin frontend building. Check back soon.');
  }
});

// Handle admin sub-routes (for React Router)
app.get('/admin/*', (req, res) => {
  const indexPath = path.join(adminDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Admin page not found');
  }
});

// Catch-all route - send user frontend for SPA routing
app.get('*', (req, res) => {
  const indexPath = path.join(userDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Page not found',
      message: 'Build the frontend first: npm run build'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 User app: https://foodprep1-ulgn.onrender.com`);
  console.log(`👑 Admin app: https://foodprep1-ulgn.onrender.com/admin`);
  console.log(`🔧 Debug: https://foodprep1-ulgn.onrender.com/debug`);
  console.log(`🧪 Test: https://foodprep1-ulgn.onrender.com/test`);
});
