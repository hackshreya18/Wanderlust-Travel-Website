const express=require("express");
const router=express.Router();


//INDEX-posts
router.get("/",(req,res)=>{
    res.send("GET for posts");
})
//POST-posts
router.post("/",(req,res)=>{
    res.send("POST for posts");
})
//SHOW-posts
router.get("/:id",(req,res)=>{
    res.send("GET for posts id");
})
//DELETE-posts
router.delete("/:id",(req,res)=>{
    res.send("DELETE for posts id");
})

module.exports=router;