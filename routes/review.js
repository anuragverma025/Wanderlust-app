const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req, res, next) => {
    if (!req.body.review) {
        throw new ExpressError("Review data is missing", 400);
    }
    if (req.body.review.rating) {
        req.body.review.rating = Number(req.body.review.rating);
    }
    const { error } = reviewSchema.validate(req.body.review);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(errMsg, 400);
    }
    next();
}

// review Route
// post
router.post("/",validateReview, wrapAsync(async (req, res) => {
    console.log("Review data:", req.body);
    let listing = await Listing.findById(req.params.id);
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview._id);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created!");
    
    res.redirect(`/listings/${listing._id}`);
}));

// Delete review Route
router.delete("/:reviewId",
    wrapAsync(async (req, res) => {
        let { id, reviewId } = req.params;
        await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted!");

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;