const express=require("express");
const router=express.Router();

//INDEX-users
router.get("/",(req,res)=>{
    res.send("GET for user");
})
//POST-users
router.post("/",(req,res)=>{
    res.send("POST for user");
})
//SHOW-users
router.get("/:id",(req,res)=>{
    res.send("GET for user id");
})
//DELETE-users
router.delete("/:id",(req,res)=>{
    res.send("DELETE for user id");
})

module.exports=router;