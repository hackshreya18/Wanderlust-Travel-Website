const Listing=require("./models/listings.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} =require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    // console.log(req.user);
    if(!req.isAuthenticated()){
        //information sent
        console.log(req.path+"...."+ req.originalUrl);
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure","Please login to create listings!!");
        return res.redirect("/login"); 
    }
    next();
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

//to check authorization:

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("failure","You are not the owner of this listing!!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

///Validating Listing:
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg= error.details.map((e)=>e.message).join(",");
        console.log(errMsg);
        throw new ExpressError(400,errMsg);
    }
    else{
        next();
    }
}

////Validating Reviews:
module.exports.validateReview=(req,res,next)=>{
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

///review Authorization
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
      req.flash("failure","You are not the author!!!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}