require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { validateEnv } = require('./env');
const assetRoutes = require('./routes/assets');
const auditRoutes = require('./routes/audits');
const maintenanceRoutes = require('./routes/maintenance');

const env = validateEnv();
const app = express();
const port = env.PORT;

app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'assetflow-api' }));
app.use('/api/assets', assetRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use((error, _req, res, _next) => {
  res.status(error.name === 'ValidationError' ? 400 : 500).json({ error: error.message });
});

async function start() {
  try {
    await mongoose.connect(env.MONGODB_URI, { dbName: env.MONGODB_DB_NAME });
    app.listen(port, () => console.log(`AssetFlow API running on port ${port}`));
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) start();

module.exports = app;
