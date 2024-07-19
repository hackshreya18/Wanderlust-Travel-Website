const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingcontroller = require("../controllers/listings.js");

/////Router.routes:

router.route("/")
.get(wrapAsync(listingcontroller.index))/// no need to define path.
.post(
  isLoggedIn,
  validateListing/*(middleware)*/,
  wrapAsync(listingcontroller.createListing)
)

//New Route;
router.get("/new",isLoggedIn,
  listingcontroller.renderNewForm
)
/////  /new should be above /:id(b/c, if it is written below, new will be treated as any id which is not correct so show error)

router.route("/:id")
.get(
  wrapAsync(listingcontroller.showListing)
)
.put(
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingcontroller.updateListing)
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.destroyListing)
)




// // Index Route:
// router.get("/",
//   wrapAsync(listingcontroller.index)
// );

//Show and Create Route:

// //Show
// router.get("/:id",
//   wrapAsync(listingcontroller.showListing)
// );

// //Create
// router.post("/",
//   isLoggedIn,
//   validateListing/*(middleware)*/,
//   wrapAsync(listingcontroller.createListing)
// );

//Edit and Update Route:
//Edit
router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingcontroller.renderEditForm)
);

// //Update
// router.put("/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingcontroller.updateListing)
// );

// //Destroy route:
// router.delete("/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingcontroller.destroyListing)
// );

module.exports=router;