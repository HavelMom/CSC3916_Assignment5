// routes/movies.js
const express  = require('express');
const mongoose = require('mongoose');
const Movie    = require('../models/Movie');
const jwtAuth  = require('../middleware/auth_jwt');
const router   = express.Router();

// protect all /movies routes
router.use(jwtAuth);

// GET /movies?reviews=true  → list, sorted by avgRating if requested
router.get('/', async (req, res) => {
  if (req.query.reviews === 'true') {
    const agg = [
      { $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews'
      }},
      { $addFields: { avgRating: { $avg: '$reviews.rating' } } },
      { $sort: { avgRating: -1 } }
    ];
    return res.json(await Movie.aggregate(agg));
  }
  res.json(await Movie.find());
});

// GET /movies/:id?reviews=true → detail with avgRating
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (req.query.reviews === 'true') {
    const agg = [
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews'
      }},
      { $addFields: { avgRating: { $avg: '$reviews.rating' } } }
    ];
    const [doc] = await Movie.aggregate(agg);
    return doc ? res.json(doc) : res.status(404).json({ message: 'Movie not found.' });
  }
  const movie = await Movie.findById(id);
  return movie ? res.json(movie) : res.status(404).json({ message: 'Movie not found.' });
});

// POST /movies  → create
router.post('/', async (req, res) => {
  const { title, releaseDate, genre, actors, imageUrl } = req.body;
  if (!title || !releaseDate || !genre || !Array.isArray(actors) || actors.length === 0) {
    return res.status(400).json({ message: 'title, releaseDate, genre & actors[] required.' });
  }
  const movie = await Movie.create({ title, releaseDate, genre, actors, imageUrl });
  res.status(201).json(movie);
});

// PUT /movies/:id → update
router.put('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  return movie ? res.json(movie) : res.status(404).json({ message: 'Movie not found.' });
});

// DELETE /movies/:id → delete
router.delete('/:id', async (req, res) => {
  const result = await Movie.findByIdAndDelete(req.params.id);
  return result
    ? res.json({ message: 'Deleted.' })
    : res.status(404).json({ message: 'Movie not found.' });
});

// POST /movies/search → partial title or actorName
router.post('/search', async (req, res) => {
  const q = req.body.query || '';
  const movies = await Movie.find({
    $or: [
      { title:            { $regex: q, $options: 'i' } },
      { 'actors.actorName': { $regex: q, $options: 'i' } }
    ]
  });
  res.json(movies);
});

module.exports = router;
