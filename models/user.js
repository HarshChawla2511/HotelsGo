const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email : {
        type : String,
        required: true,
        unique : true
    }
});
UserSchema.plugin(passportLocalMongoose);//passport k liye, username salt wo sab khud krlega passport..

module.exports = mongoose.model('User',UserSchema);