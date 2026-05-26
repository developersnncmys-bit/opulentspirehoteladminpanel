require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/', (req, res) =>
  res.json({
    name: 'Grand Palace Hotel CRM API',
    version: '1.0.0',
    docs: '/api/health',
  })
);

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() })
);

app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/bookings',      require('./routes/bookingRoutes'));
app.use('/api/guests',        require('./routes/guestRoutes'));
app.use('/api/invoices',      require('./routes/invoiceRoutes'));
app.use('/api/employees',     require('./routes/employeeRoutes'));
app.use('/api/tickets',       require('./routes/ticketRoutes'));
app.use('/api/events',        require('./routes/eventRoutes'));
app.use('/api/purchase-orders', require('./routes/poRoutes'));
app.use('/api/campaigns',     require('./routes/campaignRoutes'));
app.use('/api/contracts',     require('./routes/contractRoutes'));
app.use('/api/rate-plans',    require('./routes/ratePlanRoutes'));
app.use('/api/kots',          require('./routes/kotRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/shifts',        require('./routes/shiftRoutes'));
app.use('/api/templates',     require('./routes/templateRoutes'));
app.use('/api/spa-bookings',  require('./routes/spaBookingRoutes'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
});

module.exports = app;
