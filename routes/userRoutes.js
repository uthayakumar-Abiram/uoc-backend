import express from "express";
const router =express.Router();
import {
  authUser,
  registerStudent,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  allUsers,
  notifications,
  markAsRead,
  postContactMessages,
  getUnansweredQuestions,
  answerQuestion,
  getansweredQuestions,
  toggleLikeQuestion,
  postAnnouncement,
  getAnnouncements,
  deleteQuestion
} from "../controlers/userControler.js";
import { protect,isAdmin } from "../middleware/authMiddleware.js";

import { upload} from "../middleware/multer.js";


//for user login
router.post("/", registerStudent);                   
router.post("/auth",authUser);                   
router.post("/logout",logoutUser);               
router.get("/profile",protect,getUserProfile);   
router.put("/profile",protect,updateUserProfile); 
router.get('/allusers', protect,isAdmin,allUsers); 
router.get('/notifications', protect,notifications); 
router.put('/markasread', protect,markAsRead);  
router.post('/contactMessage',protect,postContactMessages);  
router.post('/announcement',protect,postAnnouncement);  
router.get('/announcement',protect,getAnnouncements);  
router.get("/unanswered", getUnansweredQuestions);
router.get("/answered", getansweredQuestions);
router.put("/answer", answerQuestion); 
router.post("/like/:id", protect,toggleLikeQuestion);
router.delete("/:id", protect, deleteQuestion);


export default router;

