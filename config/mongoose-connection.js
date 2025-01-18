import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;

mongoose
.connect(uri) // only on development level 
.then(()=>{
    console.log(`connected`);
})
.catch((err)=>{
    console.log(err);
})

export default mongoose.connection