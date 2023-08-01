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
const hotel = await Hotel.findById(req.params.id) //The req.params property is an object that contains the properties which are mapped to the named route "parameters".

  // populate all reviews from rreview array on hotel we are finding then populate on each one of them their author and then populate the author of hotel.
  .populate({
    path: "reviews", // see comment in review.js as review.author = req._userid
    populate: {
      path: "author",
    },
  })
  .populate("author");
// console.log(hotel); // populate is being used in reviews.populate krnese hotel const ko info mil jaegi review, author/user ki
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

  //Authorization
  if(req.user._id != "64b57c10add48b15c5592e2a"){
    req.flash('error','You dont not have permission to do that !');
    return res.redirect(`/hotels/${id}`);
  }

  const hotel = await Hotel.findByIdAndUpdate(id, { ...req.body.hotel }); //{ ...req.body.hotel }: The spread syntax { ... } is used to create a shallow copy of the req.body.hotel object. It essentially creates a new object with the same properties and values as the original req.body.hotel object.
  req.flash("success", "Successfully Updated Hotel !");
  res.redirect(`/hotels/${hotel._id}`);
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  //Authorization
  if (req.user._id != "64b57c10add48b15c5592e2a") {
    req.flash("error", "You dont not have permission to do that !");
    return res.redirect(`/hotels/${id}`);
  }
  await Hotel.findByIdAndDelete(id);
  req.flash("success", "Successfully Deleted Hotel !");
  res.redirect("/hotels/");
});

module.exports = router;