require("dotenv").config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { isDbReady } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const customerRoutes = require('./routes/customerRoutes');
const portalRoutes = require('./routes/portalRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const businessRoutes = require('./routes/businessRoutes');
const branchRoutes = require('./routes/branchRoutes');
const qrRoutes = require('./routes/qrRoutes');
const automationRoutes = require('./routes/automationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const waitlistRoutes = require('./routes/waitlistRoutes');
const aiRoutes = require('./routes/aiRoutes');
const tableRoutes = require('./routes/tableRoutes');
const menuRoutes = require('./routes/menuRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, message: 'Too many requests' },
});
app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { success: false, message: 'Too many login attempts' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/portal/login', authLimiter);

app.get('/api/health', (req, res) => {
  const dbConnected = isDbReady();
  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    message: dbConnected ? 'OpenHouseCafe API v3 — SaaS Ready' : 'API running; waiting for MongoDB',
    database: dbConnected ? 'connected' : 'disconnected',
  });
});

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next();
  if (!isDbReady()) {
    return res.status(503).json({
      success: false,
      message:
        'Database not connected. Start MongoDB on localhost:27017, or set MONGODB_URI in backend/.env (e.g. MongoDB Atlas).',
    });
  }
  return next();
});

app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/portal', portalRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/super-admin', superAdminRoutes);
app.use('/api/waitlist', waitlistRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`OpenHouseCafe API running on port ${PORT}`);
});
