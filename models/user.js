import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String,
    books:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"books",
    }]
});

export default mongoose.model("users",userSchema);