const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: {
            type: String,
            default: "https://plus.unsplash.com/premium_photo-1681255760839-6581e2eb3e96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3VtbWVyfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000",
            set: (v) => v ? v : "https://plus.unsplash.com/premium_photo-1681255760839-6581e2eb3e96?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3VtbWVyfGVufDB8fDB8fHww&fm=jpg&q=60&w=3000"
        },
        filename: {
            type: String,
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;