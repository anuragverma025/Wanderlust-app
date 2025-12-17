const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    console.log("Review data:", req.body);
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!");

    res.redirect(`/listings/${id}`);
};