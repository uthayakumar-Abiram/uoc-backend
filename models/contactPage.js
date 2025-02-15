import mongoose, { Schema } from "mongoose";

const contactSchema = new mongoose.Schema({

    userId:{type: Schema.Types.ObjectId, ref:"Student",required:true},
    question:{type:String,required:true},
    description:{type:String,required:true},
    answer:{type:String,required:false},
    answered:{type:Boolean,default:false},
    votes:[{type: Schema.Types.ObjectId, ref:"Student"}],
    visible:{type:Boolean,default:true},
    tags:[{type: Schema.Types.ObjectId, ref:"Tag"}]
    
}, { timestamps: true })

const ContactMessages =mongoose.model("contactMessages",contactSchema);

export default ContactMessages;
