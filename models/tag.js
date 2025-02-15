import mongoose, { Schema } from "mongoose";

const tagSchema = new mongoose.Schema({

    userId:{type: Schema.Types.ObjectId, ref:"Student",required:true},
    tagName:{type:String,required:true,unique:true}
    
}, { timestamps: true })

const tag =mongoose.model("Tag",tagSchema);

export default tag;
