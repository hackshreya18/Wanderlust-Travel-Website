const express=require("express");
const users= require("./router/users.js");
const post=require("./router/posts.js");
const cookieParser=require("cookie-parser");
const session = require('express-session');
const flash=require('connect-flash');
const path=require('path');

const app=express();
const port=3000;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.listen(port,()=>{
    console.log("Connected");
})

const sessionOptions={
    secret:"secret code",
    resave: false,
    saveUninitialized: true,
}

app.use(session(sessionOptions));
app.use(flash());

//form middleware:
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})
app.get("/register",(req,res)=>{
    let {name}=req.query;
    // console.log(req.session);
    req.session.name=name;
    // res.send(` Hiiii!!! ${name}`);
    
    if(!name){
        req.flash("error","user not registered");
    }
    else{
        req.flash("success","user registered successfully");
    }
    
    res.redirect("/hello");
    console.log(req.session.name);
    // console.log(req.session);
    
})
app.get("/hello",(req,res)=>{
    // console.log(req.flash("status"));
    res.render("page.ejs",{name:req.session.name});
})
// app.get("/testing",(req,res)=>{
//     res.send("hello");
// })
// app.get("/reqCount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
    
//     res.send(`You send a request ${req.session.count} times`);
// })

// app.use(cookieParser("secretcode"));







// //Send Signed Cookie:
// app.get("/getSignedCookie",(req,res)=>{
//     res.cookie("color","red",{signed:true});
//     res.send("Done!!");
// })
// //Verify Signed Cookie;
// app.get("/verifySignedCookie",(req,res)=>{
//     console.log(req.cookies);///it displays unsigned Cookies.
//     console.log(req.signedCookies);//displays all signed cookies.

//     res.send("verified");
// })



// app.get("/getcookies",(req,res)=>{
//     res.cookie("greetings","Namaste");
//     res.cookie("country","India");
//     res.send("I send u a cookie");
// })

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`Welcome ${name}`);
// })

// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("Hello,I am root");
// })

// ///USERS:
// app.use("/users",users);

// ////Posts
// app.use("/posts",post);