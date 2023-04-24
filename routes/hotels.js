const express = require('express');
const router = express.Router();
const Hotel = require("../models/hotel");
const {isLoggedIn} = require('../middleware')


router.get("/", async (req, res) => {
  const hotels = await Hotel.find({}); // Hotel.find matlab hotels ka kyuki Hotel ka hotels hota*/%>
  res.render("hotels/index", { hotels });
});

router.get("/new", isLoggedIn , async (req, res) => {
  res.render("hotels/new");
});


router.post("/", isLoggedIn, async (req, res) => {
  const hotel = new Hotel(req.body.hotel); // new.ejs ka comment pr hotel kyu use kiye samjhega
  hotel.author = req.user._id;
  await hotel.save();
  req.flash("success", "Successfully added a new Hotel !");
  res.redirect(`/hotels/${hotel._id}`);
});

router.get("/:id", async (req, res) => {
const hotel = await Hotel.findById(req.params.id)
  // populate all reviews from rreview array on hotel we are finding then populate on each one of them their author and then populate the author of hotel.
  .populate({
    path: "reviews", // see comment in review.js as review.author = req._userid
    populate: {
      path: "author",
    },
  })
  .populate("author");
console.log(hotel); // populate is being used in reviews.populate krnese hotel const ko info mil jaegi review, author/user ki
  if(!hotel){
    req.flash('error','Cannot find that Hotel !');
    return res.redirect('/hotels');
  }
  res.render("hotels/show", { hotel });
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    req.flash("error", "Cannot find that Hotel !");
    return res.redirect("/hotels");
  }
  res.render("hotels/edit", { hotel });
});

router.put("/:id", isLoggedIn, async (req, res) => {
  //res.send("IT Worked");
  const { id } = req.params;
  const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel });
  req.flash("success", "Successfully Updated Hotel !");
  res.redirect(`/hotels/${hotel._id}`);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await Hotel.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Hotel !");
  res.redirect("/hotels/");
});

module.exports = router;