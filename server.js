// server.js
require('dotenv').config();

// 1️⃣ Connect to DB
require('./db');

const express = require('express');
const cors    = require('cors');

const authRoutes   = require('./routes/auth');
const movieRoutes  = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const jwtAuth      = require('./middleware/auth_jwt');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 2️⃣ Public auth endpoints
app.use('/auth', authRoutes);

// 3️⃣ JWT-protect everything below
app.use(jwtAuth);

// 4️⃣ API endpoints
app.use('/movies',  movieRoutes);
app.use('/reviews', reviewRoutes);

// 5️⃣ 404 & error handlers
app.use((req, res) => res.status(404).json({ message:'Not found' }));
app.use((err, _, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.listen(process.env.PORT||8080, () =>
  console.log(`🚀 Server listening on port ${process.env.PORT||8080}`)
);

module.exports = app;
