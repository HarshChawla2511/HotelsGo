const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body : String,
  rating : Number,
  author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
});

module.exports = mongoose.model("Review", reviewSchema);
//hotel ko khudse hotels krke ek collection banaega mongoose.
//Onee to many relationship here.
//Therefore, we are going to embed an array of object IDs in each hotel