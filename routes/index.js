const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const serviceRoutes = require('./serviceRoutes');
const adminRoutes = require('./adminRoutes');
const vacancyRoutes  = require('./vacancyRoutes');

const mountRoutes = (app) => {
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/services', serviceRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/vacancy', vacancyRoutes);
};

module.exports = mountRoutes;
