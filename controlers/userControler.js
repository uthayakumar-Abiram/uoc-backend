

import User from "../models/userModel.js";


import asyncHandler from "express-async-handler";
import Student from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

import cloudinary from "../utils/cloudinary.js";

import ContactMessages from "../models/contactPage.js";


const authUser= asyncHandler(async(req,res)=>{
    
    const {email,password}=req.body;
    const user=await User.findOne({email});

   
    if(user && (await user.matchPassword(password))){
        
       

      const token=  generateToken(res,user._id)
        
        res.status(202).json({user,token});
       
        
    }else{
        res.status(401);
       throw new Error('Invalid email or password');
    }
   
   
});




const registerStudent = asyncHandler(async (req, res) => {
  const {
    indexNumber,
    firstName,
    lastName,
    email,
    phoneNumber,
    mailingAddress,
    gender,
    yearOfStudy,
    departmentOfStudy,
    academicAdvisor,
    password,
    role,
  } = req.body;
console.log(req.body,"test")
try {

    // Check if the student already exists
  const studentExist = await Student.findOne({ email });

  if (studentExist) {
     return res.status(400).json({message:"Student already exists"});
  }

  // Create the student record
  const student = await Student.create({
    indexNumber,
    firstName,
    lastName,
    email,
    phoneNumber,
    mailingAddress,
    gender,
    yearOfStudy,
    departmentOfStudy,
    academicAdvisor,
    password,
    role: role || "Student", // Default to "Student" if no role is provided
  });

  if (student) {
    // Generate token and send response
    generateToken(res, student._id);
   return res.status(201).json({
      user: {
        id: student._id,
        indexNumber: student.indexNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        phoneNumber: student.phoneNumber,
        mailingAddress: student.mailingAddress,
        gender: student.gender,
        yearOfStudy: student.yearOfStudy,
        departmentOfStudy: student.departmentOfStudy,
        academicAdvisor: student.academicAdvisor,
        role: student.role,
      },
    });
  } else {
    return  res.status(400).json({message:"Invalid student data"});
  }
    
} catch (error) {
    console.log("error in register",error);
    return res.status(500).json({message:error.message})
}
  
});

export default registerStudent;


const logoutUser= asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:"logout User"})
});


const getUserProfile= asyncHandler(async(req,res)=>{
   try{
    const use_Id=req.user._id;
    const profile=await User.findById(use_Id)
    
    if(profile){
    
        res.status(200).json(profile);

   }

   }catch(err){
    res.status(404)
    throw new Error(err)
   }
});


const updateUserProfile= asyncHandler(async(req,res)=>{
    const user =await User.findById(req.user._id);

    if(user){
        user.name=req.body.name || user.name;
        user.email=req.body.email ||user.email;

        if(req.body.password){
            user.password=req.body.password;
        }

        const updatedUser= await user.save();

        res.status(200).json({
            _id:updatedUser._id,
            name:updatedUser.name,
            email:updatedUser.email
        })
        
    }else{
        res.status(404);
        throw new Error("user not found")
    }
});


const allUsers = async (req, res) => {
    //enable pagination
  
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password')
            

        res.status(200).json({
            success: true,
            users,
      
        })
      
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error

        })
    }
}

const notifications =async(req,res)=>{
    try {
        const user=await User.findById(req.user._id).populate({ path: 'notifications',populate:[ {path: 'from', model: 'jobRecruit',select:''},] })//{path: 'from', model: 'jobSeeker',select:''}
        if(user){
         
            res.status(200).json({
                success: true,
                user,
            })
        }
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        }) 
    }
}

const markAsRead =async(req,res)=>{
    try {
        const user=await User.findById(req.user._id)
        if(user){
           user.notifications=user.notifications.map((note)=>{
            return(
                {...note,
                read:(note.read==false?note.read=true:note.read=true)
                }
                   
                
            )
             
           })
           let updated=await user.save();
            res.status(200).json({
                success: true,
                notifications:user.notifications
            })
        }
        
    } catch (error) {
        res.status(400).json({
            success:false,
            message:error.message
        }) 
    }
}


const postContactMessages = async (req, res) => {
    try {
        const { question, description } = req.body
        const { _id } = req.user

        console.log(req.user);

        const messageSaved = await ContactMessages.create({ userId:_id,question, description })

        if (messageSaved) {
            console.log(messageSaved);
            res.status(201).json({ success: true, message: messageSaved })
        }

    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send message" })
    }
}



export{
    authUser,registerStudent,logoutUser,getUserProfile,updateUserProfile,allUsers,notifications,markAsRead,postContactMessages
};