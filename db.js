// db.js
const mongoose = require('mongoose');

// Pull the MongoDB URI from your environment
const { DB: MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI (process.env.DB) not set');
  process.exit(1);
}

// Connect once at application startup
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Optional: monitor disconnects/reconnects
mongoose.connection.on('disconnected', () =>
  console.warn('⚠️  MongoDB disconnected — attempting reconnect')
);
mongoose.connection.on('reconnected', () =>
  console.log('🔄 MongoDB reconnected')
);

// Export the mongoose singleton for models to use
module.exports = mongoose;
