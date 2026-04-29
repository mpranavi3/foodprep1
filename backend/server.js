const express = require('express');
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
