import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    title:String,
    author:String,
    date:{
        type:Date,
        default:Date.now
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
    },
    coverImageUrl:{
        type:String,
    },
});

export default mongoose.model("books",bookSchema);
