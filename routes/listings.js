const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} =require("../schema.js");

///Validating Listing:
const validateListing=(req,res,next)=>{
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

// Index Route:
router.get("/",wrapAsync( async (req,res)=>{
    const allList= await Listing.find({});
    res.render("listings/index.ejs",{allList});
})
);

//New Route;
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
})

//Show and Create Route:

//Show
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id).populate("reviews");
    // console.log(list);
    if(!list){
      req.flash("failure","Such listing does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
  })
);

//Create
router.post("/",validateListing/*(middleware)*/, wrapAsync(async(req,res,next)=>{ 
        // if(!req.body.listing){
        //     throw new ExpressError(400,"Send Valid data for Listing");
        // }   
        const newListing= new Listing(req.body.listing);
        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing!");
        // }  
        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing!");
        // }  
        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is missing!");
        // }  
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");   
  })
);

//Edit and Update Route:
//Edit
router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    // console.log(list);
    if(!list){
      req.flash("failure","Such listing does not exists");
      res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{list});
  })
);

//Update
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){//not checking individual field
    //     throw new ExpressError(400,"Send Valid data for Listing")
    // }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});// We have insert deconstructed values.
    // console.log(listing);
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Destroy route:
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id);//This findByIdAndDelete will trigger findOneAndDelete in the listing.js to delete attached reviews.
    console.log(deleteListing);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
 })
);

module.exports=router;