require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:3000',
    'https://rachna-innovative.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/sellers', require('./routes/sellerRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/data', require('./routes/dataRoutes'));
app.use('/api/service-requests', require('./routes/serviceRequestRoutes'));
app.use('/api/zoom', require('./routes/zoomRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected!');
});

// Auto-complete stale meetings (Fallback if webhook fails/misses)
const setupAutoCompleteJob = () => {
  const Meeting = require('./models/Meeting');
  
  const autoCompleteMeetings = async () => {
    try {
      // 3 hours ago
      const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
      
      const result = await Meeting.updateMany(
        { 
          status: { $in: ['scheduled', 'ongoing'] },
          scheduledAt: { $lt: threeHoursAgo }
        },
        { $set: { status: 'completed' } }
      );
      
      if (result.modifiedCount > 0) {
        console.log(`[Cron] Auto-completed ${result.modifiedCount} stale meetings`);
      }
    } catch (err) {
      console.error('[Cron] Error auto-completing meetings:', err.message);
    }
  };

  // Run automatically every hour
  setInterval(autoCompleteMeetings, 60 * 60 * 1000);
  
  // Also run once on startup
  setTimeout(autoCompleteMeetings, 5000);
};

setupAutoCompleteJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('');
  console.log('─────────────────────────────────────────');
  console.log('  ZOOM WEBHOOK SETUP');
  console.log('─────────────────────────────────────────');
  console.log('');
  console.log('  Use this webhook URL in Zoom Marketplace:');
  console.log('');
  console.log('  https://<your-ngrok-url>/api/zoom/webhook');
  console.log('');
  console.log('  Subscribe to events:');
  console.log('    • meeting.started');
  console.log('    • meeting.ended');
  console.log('');
  console.log('─────────────────────────────────────────');
});
