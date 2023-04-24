const mongoose = require("mongoose");
const Hotel1 = require("../models/hotel");
const dbUrl = process.env.DB_URL;

//mongoose.connect("mongodb+srv://Harshuser1:uG7VQsNcnnEKQp98@cluster0.78zmnuv.mongodb.net/?retryWrites=true&w=majority", {
  mongoose.connect(dbUrl, {
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

const seedDB = async() => {
    await Hotel1.deleteMany({});
}

const seedDB1 = async () => {
    const hot = new Hotel1({
      title: "City palace",
      location: "Parbhani",
      description: "Verry ossm",
      price: "500",
      image: " https://10619-2.s.cdn12.com/rests/original/108_505269661.jpg",
      author : "64451e50a2bc7d3167516cff"
    });
    await hot.save();
}

const seedDB2 = async () => {
    const hot = new Hotel1({
      title: "Sip n Snacks",
      location: "Parbhani",
      description: "Verry ossm",
      price: "500",
      image:
        "https://content.jdmagicbox.com/comp/parbhani/p9/9999p2452.2452.220326152334.y4p9/catalogue/-taz4a4ned1.jpg",
      author : "64451e50a2bc7d3167516cff"
    });
    await hot.save();
}

const seedDB3 = async () => {
    const hot = new Hotel1({
        title : 'Raasta Cafe' ,author : "64451e50a2bc7d3167516cff",location : 'Parbhani',description : 'Verry ossm',price : '500',image: "https://content.jdmagicbox.com/comp/parbhani/e6/9999p2452.2452.211021202336.b9e6/catalogue/rasta-cafe-parbhani-ho-parbhani-fast-food-fp2mkh8gaa.jpg?clr="
    })
    await hot.save();
}

//seedDB() // ye kia to saara hi delete horaa.
seedDB1()
seedDB2()
seedDB3()
