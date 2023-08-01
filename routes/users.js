const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const User = require("../models/user");

router.get('/register',(req,res) => {
    res.render('users/register');
})

router.post("/register", async (req, res) => {
  const {email,username,password} = req.body;
  const user = new User({email,username});
  const registetredUser = await User.register(user,password);
  // console.log(registetredUser);
  req.flash('success','Welcome to Hotel Hunt !');
  res.redirect('/hotels');
});
//register(user,password,cb) : Conveinience method to register a new user to regiter a new user instanc with a given passwowrd.Checks if username is unique.
//By adding those properties to the User Schema, their values would be saved in the database as plain text, which is a big security risk, especially for the password; in that case, the passportLocalMongoose package along with passport will handle the user authentication behind the scenes, automatically adding the username and password fields, guaranteeing some features, i.e. making sure the username is unique, the password was cryptographed, etc.

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post("/login",passport.authenticate('local',{failureFlash : true, failureRedirect : '/login'}),(req, res) => {   // authenticate(strategy like google etc) Here it is local!
  //failure flash wo khud hi inbuilt hai so aayega flash .Compare wo sab khud hota
  console.log(req.session);
  req.flash("success", "Welcome back to Hotel Hunt !");
  res.redirect("/hotels");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash('success',"Goodbye!");
  res.redirect('/hotels');
});


module.exports = router;