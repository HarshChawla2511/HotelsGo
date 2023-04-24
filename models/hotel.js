const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require("./review");

const HotelSchema = new Schema({
    title : String,
    price : String,
    image : String,
    description : String,
    location : String,
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    reviews: [
        {
        type : Schema.Types.ObjectId, //Ref is the review model and we have taking review array her.
        ref : 'Review'   
        }
    ]
});
//middleware for if a hotel is deleted then all the reviews related to it ust be deleted too.
HotelSchema.post('findOneAndDelete',async function(doc){  // when findByIdAndDelete is executed this middleware function is triggered (findOneAndDelete) as per mongoose middleware 
    if(doc){                                              //we get doc khudse so we pass it
        await Review.deleteMany({
            _id :{
                $in : doc.reviews   // shows that id for each review is somewhere in doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Hotel', HotelSchema)
//hotel ko khudse hotels krke ek collection banaega mongoose.