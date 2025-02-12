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
} from "../controlers/userControler.js";
import { protect,isAdmin } from "../middleware/authMiddleware.js";

import { upload} from "../middleware/multer.js";


//for user login
router.post("/", registerStudent);                    //done
router.post("/auth",authUser);                    //done
router.post("/logout",logoutUser);                //done
router.get("/profile",protect,getUserProfile);    //done
router.put("/profile",protect,updateUserProfile); 
router.get('/allusers', protect,isAdmin,allUsers);  //done
router.get('/notifications', protect,notifications);  //done
router.put('/markasread', protect,markAsRead);   //done
router.post('/contactMessage',postContactMessages);   



export default router;

