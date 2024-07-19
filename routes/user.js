const express=require("express");
const router=express.Router();
const User=require("../models/users.js");
const wrapAsync=require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/users.js");

///// Home Page /////
router.get("/",
    userController.renderHomePage
)


/////Router.route:

router.route("/signup")
.get(
    userController.rendersignupForm
)
.post(
    wrapAsync(userController.signup)
)


router.route("/login")
.get(
    userController.renderloginForm
)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:"Password or Username is incorrect!!"
    }),
    userController.login
)




// ///// Sign Up //////
// router.get("/signup",
//     userController.rendersignupForm
// )

// router.post("/signup",
//     wrapAsync(userController.signup)
// )


/////// Login ////////
router.get("/login",
    userController.renderloginForm
);

router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local",{
        failureRedirect:"/login",
        failureFlash:"Password or Username is incorrect!!"
    }),
    userController.login
)


////// Logout /////////

router.get("/logout",
    userController.logout
);
module.exports=router;