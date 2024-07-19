const mongoose = require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

const MongoUrl="mongodb://127.0.0.1:27017/Wanderlust";

main().then((res)=>{
    console.log("Connected!!");
}).catch((err)=>{
    console.log(err);
})
async function main(){
 
    await mongoose.connect(MongoUrl);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"668e37c34ff4ef8a65fce09f"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();