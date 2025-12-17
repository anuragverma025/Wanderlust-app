const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listings!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner =async(req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of listing");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
        if(error) {
            let errMsg = error.details.map(el => el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else {
            next();
        }
};

module.exports.validateReview = (req, res, next) => {
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

module.exports.isReviewAuthor =async(req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
};