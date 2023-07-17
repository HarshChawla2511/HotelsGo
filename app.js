const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const ejsmate = require('ejs-mate')
const methodOverride = require('method-override')
const Hotel = require('./models/hotel')
const Review = require("./models/review");
const session = require('express-session')
//const MongoStore = require("connect-mongo");
const flash = require('connect-flash');
const passport = require('passport');
const Localstrategy = require('passport-local');
const User = require('./models/user');
//const dbUrl = process.env.DB_URL;
//const MongoDBStore = require("connect-mongo")(session);

const userRoutes = require('./routes/users');
const hotelRoutes = require('./routes/hotels');
const reviewRoutes = require("./routes/reviews");

//mongoose.connect("mongodb://localhost:27017/HotelHunt", {
mongoose.connect("mongodb+srv://Harshuser1:uG7VQsNcnnEKQp98@cluster0.78zmnuv.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine('ejs',ejsmate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, "public")));  // serving static website.


app.use(express.urlencoded({ extended: true })); // to parse upar ki post req.
app.use(methodOverride("_method")); // for put req(for editing)/delete

// const store = MongoStore.create({
//   mongoUrl:"mongodb+srv://Harshuser1:uG7VQsNcnnEKQp98@cluster0.78zmnuv.mongodb.net/?retryWrites=true&w=majority",
//   touchAfter: 24 * 60 * 60,
//   secret: "thisshouldbeabettersecret!",
// });
// const store =  new MongoDBStore({
//   url: "mongodb+srv://Harshuser1:uG7VQsNcnnEKQp98@cluster0.78zmnuv.mongodb.net/?retryWrites=true&w=majority",
//   secret: 'thisshouldbeabettersecret',
//   touchAfter: 24 * 60* 60
// })
// store.on("error",function(e){
//   console.log("SESSION STORE ERROR",e)
// })

const sessionConfig = {
  //store,
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly : true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // becuase date is in milliseconds.
    maxAge: 1000 * 60 * 60 * 24 * 500//5 dayys me session expire.
  }
} //resave aur saveuninitalized igrnore kro(secret me bhi kuch hai nai aabtk to)


app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());//it should be after session ka part.
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));  //authnticate - generates a func that is used in passport local strategy built-in. 

passport.serializeUser(User.serializeUser());//Tells passpirt hiw ti serialize a user ie how to storea  user on the session.
passport.deserializeUser(User.deserializeUser()); // How do you get a user out of the session.

app.use((req,res,next) =>{
  res.locals.currentUser = req.user;  //req.user user ki saaari info de dega (passport k wajahse).
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error"); // Saare views ke response ke part ko include krlega.
  next();
})
//res.locals is an object that is available in Node.js applications that use the Express framework. It is a way to store information that is local to the current request/response cycle.
////Overall, res.locals provides a convenient way to pass data from your server-side code to your view templates without having to manually pass it as a variable to every template.
app.use('/',userRoutes)   
app.use('/hotels',hotelRoutes)
app.use("/hotels/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

// app.get("/makehotel", async(req,res) => {
//     const hot = new Hotel({title : 'City Palace', description : 'Very good'});
//     await hot.save();
//     res.send(hot)
// });


app.listen(3000, () => {
  console.log("Serving on port 3000");
});