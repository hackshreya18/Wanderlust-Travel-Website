const mongoose = require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");

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
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initDB();