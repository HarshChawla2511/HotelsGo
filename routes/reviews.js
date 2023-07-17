const express = require("express");
const router = express.Router({mergeParams : true}); //karna padhta nahi to id nahi lera wo router.
const Review = require("../models/review");
const Hotel = require("../models/hotel");
const { isLoggedIn } = require("../middleware");

router.post("/",isLoggedIn, async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  const review = new Review(req.body.review);
  hotel.reviews.push(review);
  review.author = req.user._id; // THis is used in adding review !!!!!!!
  await review.save();
  await hotel.save();
  req.flash("success", "Created new review !");
  res.redirect(`/hotels/${hotel._id}`);
});

router.delete("/:reviewId", async (req, res) => {
  //res.send("IT worked!")
  const { id, reviewId } = req.params;  // id hotel ki hai , reviewId review ki hai.
  await Hotel.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); //pull operator revies array  me review Id lenga aur usko pull krlenga hotel id jo passki usmese.
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted hotel !");
  res.redirect(`/hotels/${id}`);
});

module.exports = router;