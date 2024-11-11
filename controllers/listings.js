const Listing=require("../models/listings.js");

// Index Route:
module.exports.index=async (req,res)=>{
    const allList= await Listing.find({});
    res.render("listings/index.ejs",{allList});
}

// New Route:
module.exports.renderNewForm=(req,res)=>{
    // console.log(req.user);
      res.render("listings/new.ejs");
}

//Show and Create Route:

//Show
module.exports.showListing = async(req,res)=>{
    let {id}=req.params;

    let list= await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author",
      },
    })
    .populate("owner");

    // console.log(list);
    if(!list){
      req.flash("failure","Such listing does not exists");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs",{list});
}  

//Create
module.exports.createListing =async(req,res,next)=>{ 
    let url= req.file.path;
    let filename = req.file.filename;
    // console.log(url ," ", filename);
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
    console.log(req.user);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
    await newListing.save();

    req.flash("success","New Listing Created!");
    res.redirect("/listings");   
}

//Edit and Update Route:
//Edit

module.exports.renderEditForm =async(req,res)=>{
    let {id}=req.params;
    let list= await Listing.findById(id);
    // console.log(list);
    if(!list){
      req.flash("failure","Such listing does not exists");
      res.redirect("/listings");
    }
    let originalImg=list.image.url;
    originalImg=originalImg.replace("/upload","/upload/w_300")
    res.render("listings/edit.ejs",{list,originalImg});
}

//Update 

module.exports.updateListing =async(req,res)=>{
    let {id}=req.params;
    // if(!req.body.listing){//not checking individual field
    //     throw new ExpressError(400,"Send Valid data for Listing")
    // }

    ////for authorization
    // let listing= await Listing.findById(id);
    // if(!listing.owner._id.equals(res.locals.currUser._id)){
    //   req.flash("failure","You don't have permission to edit");
    //   return res.redirect(`/listings/${id}`);
    // }
    /////Till above here(for authorization)
   
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});// We have insert deconstructed values.

    // console.log(req.file);
    if(typeof req.file !== "undefined"){
      let url= req.file.path;
      let filename = req.file.filename;
      listing.image={url,filename};

      await listing.save();
    }
    


    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
}

//Delete route:
module.exports.destroyListing =  async(req,res)=>{
    let {id}=req.params;
    let deleteListing= await Listing.findByIdAndDelete(id);//This findByIdAndDelete will trigger findOneAndDelete in the listing.js to delete attached reviews.
    // console.log(deleteListing);
    req.flash("success","Listing Deleted!!");
    res.redirect("/listings");
 }  