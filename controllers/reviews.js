const GameReview = require("../models/GameReview");
const mongoose = require("mongoose");

// Get all reviews 
const index = async (req, res) => {

  const allReviews = await GameReview.find()

  res.json(allReviews);

};

// Get all reviews 
const indexByUser = async (req, res) => {

  // Get only user reviews
  const allUsersReviews = await GameReview.find({ user: req.params.user });

  res.json(allUsersReviews);

};

// RENDER new review page display, wuth or without game selection.  
const newReview = async (req, res) => {

  const gameID = null;

  // Check if a game has already been selected for the review. 
  if (req.params.gameID) {

    gameID = req.params.gameID;

  }

  res.json(gameID);

};

const show = async (req, res) => {
  
  // Get review to show. 
  const reviewToshow = await GameReview.findById(req.params.reviewID);

  // Send review to show. 
  res.json(reviewToshow);

  
};

// CREATE new review in DB 
const create = async (req, res) => {

  console.log(req.body); 
  
  // Create the review
  const newReview = await GameReview.create(req.body);

  res.json(newReview);

}

// DELETE the selected review
const deleteReview = async (req, res) => {

  // Delete the review. 
  await GameReview.findByIdAndDelete(req.params.reviewID);

  // Gather index of reviews to send back to apge. 
  const allReviews = await GameReview.find()

  res.json(allReviews);

}

// Get data of review to EDIT
const edit = async (req, res) => {

  const reviewToEdit = await GameReview.findByIdAndUpdate(req.params.reviewID,
    {
      stars: req.body.stars,
      title: req.body.title,
      body: req.body.body,
      likes: req.body.likes,
      dislikes: req.body.dislikes
    },
    { new: true });

  res.json(reviewToEdit);
}


module.exports = {
  index,
  new: newReview,
  create,
  delete: deleteReview,
  edit,
  show,
  indexByUser,
};