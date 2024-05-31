const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} =require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");


////Validating Reviews:
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((e)=>e.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}


//Post review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    let listing=await Listing.findById(id);
    //adding review:
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete review route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    let dltList=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    let dltReview= await Review.findByIdAndDelete(reviewId);

    // console.log(dltReview);
    // console.log(dltList);
    req.flash("success","Review Deleted!!");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;