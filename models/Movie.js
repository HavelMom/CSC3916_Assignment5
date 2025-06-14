const mongoose = require('../db');
const Schema = mongoose.Schema;
const express = require('express');

// Connect to MongoDB
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Movie schema
const MovieSchema = new Schema({
  title: { type: String, required: true, index: true },
  releaseDate: { type: Number, min: [1900, 'Must be greater than 1899'], max: [2100, 'Must be less than 2100']},
  genre: {
    type: String,
    enum: [
      'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction'
    ],
  },
  actors: [{
    actorName: String,
    characterName: String,
  }],
  imageUrl: { type: String, required: true },
});

// Create Movie model
const Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;
