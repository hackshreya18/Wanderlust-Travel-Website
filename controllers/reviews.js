const Listing = require("../models/listings");
const Review =require("../models/review.js");

////Post review route

module.exports.createReview=async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let listing=await Listing.findById(id);
    //adding review:
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;

    // console.log(req.user._id);
    console.log(newReview);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${id}`);
}

//Delete review route
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewId}=req.params;
    let dltList=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    let dltReview= await Review.findByIdAndDelete(reviewId);

    // console.log(dltReview);
    // console.log(dltList);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
}