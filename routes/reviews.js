// routes/reviews.js
const express = require('express');
const Review  = require('../models/Review');
const jwtAuth = require('../middleware/auth_jwt');
const router  = express.Router();

// protect all /reviews routes
router.use(jwtAuth);

// POST /reviews  → add a review
router.post('/', async (req, res) => {
  const { movieId, rating, comment } = req.body;
  if (!movieId || rating == null || !comment) {
    return res.status(400).json({ message: 'movieId, rating & comment required.' });
  }
  const review = await Review.create({
    movieId,
    rating,
    comment,
    username: req.user.username
  });
  res.status(201).json(review);
});

// GET /reviews/:movieId → list reviews for that movie
router.get('/:movieId', async (req, res) => {
  const reviews = await Review.find({ movieId: req.params.movieId });
  res.json(reviews);
});

module.exports = router;
