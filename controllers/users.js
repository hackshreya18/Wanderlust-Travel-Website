const User=require("../models/users.js");

/////Home Page////
module.exports.renderHomePage=(req,res)=>{
    // res.send("form");
    res.render("users/home.ejs");
}

///// Sign Up //////
module.exports.rendersignupForm=(req,res)=>{
    // res.send("form");
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        // console.log(username,email,password);
        let newUser=new User({email,username})
        let rigisteredUser=await User.register(newUser,password);
        console.log(rigisteredUser);

        req.login(rigisteredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust");
            res.redirect("/listings");
        })

    }
    catch(e){
        req.flash("failure","Failed to register!!");
        res.redirect("/signup");
    }   
}

/////// Login ////////
module.exports.renderloginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("success","Welcome to Wanderlust, You are logged!!");
    if(!res.locals.redirectUrl){
        res.redirect("/listings");
    }
    else{
        res.redirect(res.locals.redirectUrl);
    }   
}

///// Logout ///////
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You Logged Out Successfully");
        res.redirect("/listings");
    });
}