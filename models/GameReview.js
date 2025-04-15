const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: String,
  gameAPIId: Number, // Connect game ID from API
  stars: {type: Number, enum: [1, 2, 3, 4, 5]},
  title: String,
  body: String,
  likes: Number,
  dislikes: Number
});

const Review = mongoose.model("Review", reviewSchema); // create model
module.exports = Review;