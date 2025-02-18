import mongoose, { Schema } from "mongoose";

const announcementSchema = new mongoose.Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Student", required: true }, 
    title: { type: String, required: true }, 
    content: { type: String, required: true },
    visible: { type: Boolean, default: true }, 
    bulletPoints: [{ type: String }], 
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);

export default Announcement;