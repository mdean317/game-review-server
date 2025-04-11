const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: String, // reference user object
  gameId: String,
  stars: Number, // limit between 1 and 5
  title: String,
  body: String,
  likes: Number,
  dislikes: Number
});

const Review = mongoose.model("Review", reviewSchema); // create model
module.exports = Review;