const express=require("express");
const app=express();
const port=8080;
const mongoose=require("mongoose");
 
const path=require("path");
const MongoUrl="mongodb://127.0.0.1:27017/Wanderlust";
const methodOverride = require('method-override')
const ejsMate= require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require('express-session');
const flash= require('connect-flash');

const listings=require("./routes/listings.js");
const reviews=require("./routes/reviews.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

const sessionOptions={
    secret:"mysecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 4*24*60*60*1000,
        maxAge: 4*24*60*60*1000,
        httpOnly:true
    }
}

main().then((res)=>{
    console.log("Connected!!");
}).catch((err)=>{
    console.log(err);
})
 async function main(){
    await mongoose.connect(MongoUrl);
 }

app.listen(port,()=>{
    console.log("server is listening to port 8080");
})

app.get("/",(req,res)=>{
    res.render("listings/home.ejs");
})

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    console.log(res.locals.success);
    console.log(res.locals.failure);
    next();
})

// app.get("/testListing",(req,res)=>{
//     let sampleListing= new Listing ({
//         title:"my home",
//         description:"by beach",
//         price:1200,
//         location:"Calangute,Goa",
//         country:"India"
//     });

//     sampleListing.save().then((res)=>{
//         console.log(res);
//     }).catch((err)=>{
//         console.log(err);
//     })
//     res.send("hello peaople Welcome to Goa.")
// });


////   LISTINGS   ////
app.use("/listings",listings);

////   REVIEWS   ////
app.use("/listings/:id/reviews",reviews);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!!"));
})

app.use((err,req,res,next)=>{
   let{statusCode=500,message="Something is Wrong!! Try again"}=err;
      res.status(statusCode).render("error.ejs",{err});
})
